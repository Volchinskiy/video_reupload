from PIL import Image
import sys

imgName = sys.argv[1]
img = Image.open("./apps/remove_gs/img_to_remove_gs/" + imgName)
img_data = img.load()
height, width = img.size

for i in range(height):
  for j in range(width):
    r, g, b, o = img_data[i, j]
    if 255 > g > 80 and r < 120 and b < 80:
      img_data[i, j] = 0, 0, 0, 0
# process.env.GS_OUTPUT_FOLDER=./apps/remove_gs/img_without_gs/
img.save("./apps/remove_gs/img_without_gs/" + imgName)
