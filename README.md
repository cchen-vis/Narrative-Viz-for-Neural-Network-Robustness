<style TYPE="text/css">
code.has-jax {font: inherit; font-size: 100%; background: inherit; border: inherit;}
</style>
<script type="text/x-mathjax-config">
MathJax.Hub.Config({
    tex2jax: {
        inlineMath: [['$','$'], ['\\(','\\)']],
        skipTags: ['script', 'noscript', 'style', 'textarea', 'pre'] // removed 'code' entry
    }
});
MathJax.Hub.Queue(function() {
    var all = MathJax.Hub.getAllJax(), i;
    for(i = 0; i < all.length; i += 1) {
        all[i].SourceElement().parentNode.className += ' has-jax';
    }
});
</script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS_HTML-full"></script>

# Narrative-Viz-for-Neural-Network-Robustness
## Datasets
 - clean_and_adversarial_acc_AT_model.csv : contains clean accuracy and adversarial accuracy at each epoch for the adversarial-trained model
 - clean_and_adversarial_acc_NT_model.csv : contains clean accuracy and adversarial accuracy at each epoch for the naturally-trained model
 - sampleImages_AT.json: selected images for the adversarial-trained model; of size [10,10,32,32,3], [10 steps of PGD] * [10 images (whose labels are from 0 to 9)] * [32 32 3, which is the image size]
 - sampleImages_NT.json: selected images for the naturally-trained model; of size [10,10,32,32,3], [10 steps of PGD] * [10 images (whose labels are from 0 to 9)] * [32 32 3, which is the image size]
 - stepWiseLoss_AT.json: stepwise loss for the images in sampleImages_AT.json; of size [10,10], [10 steps of PGD] * [10 images (whose labels are from 0 to 9)]
 - stepWiseLoss_NT.json: stepwise loss for the images in sampleImages_NT.json; of size [10,10], [10 steps of PGD] * [10 images (whose labels are from 0 to 9)]
 - stepWiseProb_AT.json: stepwise output probabilities for the images in sampleImages_AT.json; of size [10,10,10], [10 steps of PGD] * [10 images (whose labels are from 0 to 9)] * [10 labels]
 - stepWiseProb_NT.json: stepwise output probabilities for the images in sampleImages_NT.json; of size [10,10,10], [10 steps of PGD] * [10 images (whose labels are from 0 to 9)] * [10 labels]
 - examplesOutputProbPerEpoch_NT.json: selected examples' output probabilities per epoch for the naturally-trained model; of size [100, 10, 10], [100 epochs] * [10 images] * [10 labels]
 - clean_and_adversarial_acc_NT_model.csv: clean accuracy and adversarial accuracy for models trained with different $\epsilon$ (a.k.a. attacking radius)