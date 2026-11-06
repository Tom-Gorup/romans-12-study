"""Render the site's native typography and three-dot mark as a 1200×630 social card.

Requires Pillow and NumPy. The SVG alongside this file is the editable vector
reference; the committed PNG is the deployable image, so no build is required.
"""
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
S = 2
W, H = 1200, 630
# Match the subtle radial background of the presentation.
y, x = np.mgrid[0:H*S, 0:W*S].astype(float)
x, y = x/S, y/S
r = np.clip(np.sqrt(((x-780)/960)**2 + ((y-265)/800)**2), 0, 1)
colors = np.array([[27,25,21], [16,16,15], [9,9,9]], dtype=float)
bg = np.stack([np.interp(r, [0,.6,1], colors[:,c]) for c in range(3)], axis=-1)
glow = np.clip(1 - np.sqrt((x-953)**2+(y-304)**2)/230, 0, 1)[...,None]*.07
bg = bg*(1-glow) + np.array([201,109,58])*glow
im = Image.fromarray(bg.astype('uint8'), 'RGB')
d = ImageDraw.Draw(im)
fonts = Path('/usr/share/fonts/truetype/noto')
def text(x,y,value,font,size,fill,spacing=0):
    f=ImageFont.truetype(str(fonts/font),size*S)
    # SVG-style baseline positioning. Explicit tracking preserves the native look.
    for c in value:
        d.text((round(x*S),round(y*S)),c,font=f,fill=fill,anchor='ls')
        x += d.textlength(c,font=f)/S+spacing

def circle(x,y,r,fill):
    d.ellipse(((x-r)*S,(y-r)*S,(x+r)*S,(y+r)*S),fill=fill)
def line(x1,y1,x2,y2,color,width=1):
    d.line((x1*S,y1*S,x2*S,y2*S),fill=color,width=width*S)
line(96,114,152,114,'#dd8652',3)
text(176,121,'ANNOTATED STUDY','NotoSans-Regular.ttf',18,'#aaa59b',4)
text(90,292,'Romans 12','NotoSerif-Regular.ttf',96,'#e9e4d9',-5)
text(96,377,'therefore','NotoSerif-Italic.ttf',54,'#dd8652',-1)
for cx,cy in [(879,239),(1019,239),(949,383)]: circle(cx,cy,33,'#dd8652')
line(96,475,1104,475,'#474038')
text(96,531,'WORSHIP','NotoSans-Regular.ttf',20,'#bbb5aa',3)
circle(257,524,2.5,'#c96d3a')
text(285,531,'SERVICE','NotoSans-Regular.ttf',20,'#bbb5aa',3)
circle(434,524,2.5,'#c96d3a')
text(462,531,'GENUINE LOVE','NotoSans-Regular.ttf',20,'#bbb5aa',3)
im.resize((W,H),Image.Resampling.LANCZOS).save(ROOT/'dist/assets/romans-12-social-20261106.png',optimize=True)
