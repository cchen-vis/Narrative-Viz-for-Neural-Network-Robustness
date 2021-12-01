# Narrative-Viz-for-Neural-Network-Robustness
## Setup
Run `python -m http.server 8080`, and you should be able to see the demo at http://localhost:8080/.


## Datasets
 - clean_and_adversarial_acc_AT_model.csv : contains clean accuracy and adversarial accuracy at each epoch for the adversarial-trained model
 - clean_and_adversarial_acc_NT_model.csv : contains clean accuracy and adversarial accuracy at each epoch for the naturally-trained model
 - sampleImages_AT.json: selected images for the adversarial-trained model; of size [10,10,32,32,3], [10 steps of PGD] * [10 images (whose labels are from 0 to 9)] * [32 32 3, which is the image size]
 - sampleImages_NT.json: selected images for the naturally-trained model; of size [10,10,32,32,3], [10 steps of PGD] * [10 images (whose labels are from 0 to 9)] * [32 32 3, which is the image size]
 - stepWiseLoss_AT.json: stepwise loss for the images in sampleImages_AT.json; of size [10,10], [10 steps of PGD] * [10 images (whose labels are from 0 to 9)]
 - stepWiseLoss_NT.json: stepwise loss for the images in sampleImages_NT.json; of size [10,10], [10 steps of PGD] * [10 images (whose labels are from 0 to 9)]
 - stepWiseProb_AT.json: stepwise output probabilities for the images in sampleImages_AT.json; of size [10,10,10], [10 steps of PGD] * [10 images (whose labels are from 0 to 9)] * [10 labels]
 - stepWiseProb_NT.json: stepwise output probabilities for the images in sampleImages_NT.json; of size [10,10,10], [10 steps of PGD] * [10 images (whose labels are from 0 to 9)] * [10 labels]
 - NT_OutputProbPerEpoch4examples.json: selected examples' output probabilities per epoch for the naturally-trained model; of size [100, 10, 10], [100 epochs] * [10 images] * [10 labels]
 - clean_and_adversarial_acc_NT_model.csv: clean accuracy and adversarial accuracy for models trained with different &epsilon; (a.k.a. attacking radius)