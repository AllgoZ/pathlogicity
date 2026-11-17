import sys, numpy as np, cv2
from PIL import Image
src, out_photo, out_sketch, out_prev = sys.argv[1:5]
full = len(sys.argv) > 5 and sys.argv[5] == "full"  # a plain photograph (round 9): sketch the whole frame, no supplied drawing
im = Image.open(src).convert("RGB")
W = 2560
H = round(im.height * W / im.width)
im = im.resize((W, H), Image.LANCZOS)
im.save(out_photo, "WEBP", quality=82, method=6)
a = np.array(im)
g = cv2.cvtColor(a, cv2.COLOR_RGB2GRAY)
# pencil-sketch of the photograph: colour-dodge of the grey against its blurred inverse
inv = 255 - g
blur = cv2.GaussianBlur(inv, (0, 0), 6)
dodge = cv2.divide(g, 255 - blur, scale=256).astype(np.float32)
dodge = np.clip((dodge - 150) * (255 / 105), 0, 255)  # lift paper to white, keep line weight
# soften to the grey of the supplied pencil lines
sk = 255 - (255 - dodge) * 0.78
sk3 = np.stack([sk, sk, sk], -1)
# keep the client's own drawing on the right, our sketch of the photo on the left, crossfade over 50–66 %
x = np.linspace(0, 1, W)
t = np.clip((x - 0.50) / 0.16, 0, 1)[None, :, None]
if full:
    t = t * 0
# paper tint of the supplied art
paper = np.array([250, 246, 238.0]) if full else a[int(H*0.08):int(H*0.2), int(W*0.9):int(W*0.98)].reshape(-1,3).mean(0)
tint = (paper / 255.0)[None, None, :]
left = sk3 * tint
res = left * (1 - t) + a.astype(np.float32) * t
Image.fromarray(np.clip(res, 0, 255).astype(np.uint8)).save(out_sketch, "WEBP", quality=80, method=6)
Image.fromarray(np.clip(res, 0, 255).astype(np.uint8)).resize((1280, round(H*1280/W))).save(out_prev)
print(W, H)
