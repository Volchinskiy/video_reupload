from PIL import Image
import sys

image = Image.open('./img_to_remove_gs/1.png')
image_data = image.load()
height, width = image.size

print(sys.argv[1])

for loop1 in range(height):
  for loop2 in range(width):
    r, g, b, s = image_data[loop1, loop2]
    if 255 > g > 80 and r < 120 and b < 80:
      image_data[loop1, loop2] = 0, 0, 0, 0

image.save('./img_without_gs/1.png')
