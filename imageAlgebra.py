from PIL import Image, ImageOps
import numpy as np
import json

# data[step][label]

if __name__ == "__main__":
    f = open("Datasets/sampleImages_NT.json",)
    data = json.load(f)

    # For generating all of the images
    # for i in range(0,10):
    #     for j in range(0,10):

    #         pixels = data[str(i)][j]
    #         normPixels = np.array(pixels)
    #         pixels = 255 * (normPixels)
    #         array = np.array(pixels, dtype=np.uint8)
    #         array = np.transpose(array, (1, 2, 0))

    #         img = Image.fromarray(array, mode='RGB')
    #         img.save("img" + str(j) + str(i) + ".png")

    # For generating all of the differences between original and adversarial images
    # for lab in range(0,10):
    #     for step in range(0,11):
    #         pixels = data[str(step)][0]
    #         normPixels = np.array(pixels)
    #         pixels = 255 * (normPixels)
    #         array1 = np.array(pixels, dtype=np.uint8)
    #         # array1 = np.transpose(array, (1, 2, 0))

    #         pixels = data[str(step)][lab]
    #         normPixels = np.array(pixels)
    #         pixels = 255 * (normPixels)
    #         array2 = np.array(pixels, dtype=np.uint8)
    #         # array2 = np.transpose(array, (1, 2, 0))

    #         for k in range(0,3):
    #             array = abs(array1[k]-array2[k])

    #             img = Image.fromarray(array, mode='L')
    #             if k == 0:
    #                 img = ImageOps.colorize(img, white="red", black="black")
    #                 # img.show()
    #                 img.save("img" + str(step) + str(lab) + "r.png")
    #             elif k == 1:
    #                 img = ImageOps.colorize(img, white="green", black="black")
    #                 # img.show()
    #                 img.save("img" + str(step) + str(lab) + "g.png")
    #             elif k == 2:
    #                 img = ImageOps.colorize(img, white="blue", black="black")
    #                 # img.show()
    #                 img.save("img" + str(step) + str(lab) + "b.png")


    # Test space
    step = 10
    label = 0
    pixels1 = data["0"][label]
    normPixels1 = np.array(pixels1)
    pixels1 = 255 * (normPixels1)
    array1 = np.array(pixels1, dtype=np.uint8)
    arr1 = np.transpose(array1, (1, 2, 0))
    img = Image.fromarray(arr1, mode='RGB')
    img.show()

    pixels2 = data[str(step)][label]
    normPixels2 = np.array(pixels2)
    pixels2 = 255 * (normPixels2)
    array2 = np.array(pixels2, dtype=np.uint8)
    arr2 = np.transpose(array2, (1, 2, 0))
    img = Image.fromarray(arr2, mode='RGB')
    img.show()

    for k in range(0,3):
        array = abs(array1[k]-array2[2])
        print(array)

        img = Image.fromarray(array, mode='L')
        if k == 0:
            img = ImageOps.colorize(img, white="red", black="black")
            img.show()
            # img.save("img" + str(step) + str(lab) + "r.png")
        elif k == 1:
            img = ImageOps.colorize(img, white="green", black="black")
            img.show()
            # img.save("img" + str(step) + str(lab) + "g.png")
        elif k == 2:
            img = ImageOps.colorize(img, white="blue", black="black")
            img.show()
            # img.save("img" + str(step) + str(lab) + "b.png")