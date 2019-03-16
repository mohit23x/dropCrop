function mainCrop(divid, canvasid, cropid, resetid, inputid, resultid, aspectRatio) {

    var parentDiv = document.getElementById(divid);
    var canvas = document.getElementById(canvasid);
    var btnCrop = document.getElementById(cropid);
    var btnReset = document.getElementById(resetid);
    var inputField = document.getElementById(inputid);
    var result = document.getElementById(resultid);

    const parentHeight = parentDiv.offsetHeight;
    const parentWidth = parentDiv.offsetWidth;
    var context = canvas.getContext("2d");

    canvasBanner();

    ["drag", "dragstart", "dragend", "dragover", "dragleave", "drop"].forEach(event => canvas.addEventListener(event, function(e) {
        e.preventDefault();
        e.stopPropagation();
    }));

    ["dragenter", "dragover"].forEach(event => canvas.addEventListener(event, function(e) {
        try {
            canvas.cropper.clear();
            canvas.cropper.destroy();
        } catch (err) {}
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.canvas.height = parentHeight;
        context.canvas.width = parentWidth;
        canvasBannerHover();

    }));

    ["dragleave dragend"].forEach(event => canvas.addEventListener(event, function(e) {
        canvasBanner();
    }));

    canvas.addEventListener("drop", function(e) {

        droppedFile = e.dataTransfer.files;
        cropWorker(droppedFile[0]);
    });

    canvas.addEventListener('click', function(e) {
        inputField.click();
        inputField.addEventListener("change", function(e) {
            var file = e.target.files[0];
            cropWorker(file);

        })
    })

    btnCrop.addEventListener("click", async function(e) {
        var croppedImage = await canvas.cropper.getCroppedCanvas().toDataURL("image/png");

        var cropImg = new Image();
        cropImg.onload = function() {
            context.canvas.height = cropImg.height;
            context.canvas.width = cropImg.width;
            context.drawImage(cropImg, 0, 0);
        }
        canvas.cropper.destroy();
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        cropImg.src = croppedImage;
        result.src = croppedImage;
    });

    btnReset.addEventListener("click", function(e) {
        try {
            canvas.cropper.clear();
            canvas.cropper.destroy();
        } catch (err) {}
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        canvasBanner();
    });

    function cropWorker(file) {

        var reader = new FileReader();
        reader.onload = function(event) {
            var img = new Image();
            img.onload = function() {
                context.canvas.height = img.height;
                context.canvas.width = img.width;
                context.drawImage(img, 0, 0);
                var cropper = new Cropper(canvas, {
                    aspectRatio: aspectRatio,
                });
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }


    function canvasBanner() {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.canvas.height = parentHeight;
        context.canvas.width = parentWidth;

        var uploadImg = new Image();
        uploadImg.onload = function() {
            uploadImg.height = "10px";
            uploadImg.width = "10px";
            context.drawImage(uploadImg, context.canvas.width / 2 - 25, context.canvas.height / 2 - 40, 40, 40);
        }

        uploadImg.src = "data:image/png;base64,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";

        context.font = "12px Arial";
        context.textAlign = "center";
        context.fillStyle = "black";
        context.fillText("Drag and drop your image here.", context.canvas.width / 2, context.canvas.height / 2 + 25);

        context.lineWidth = 2;
        context.setLineDash([12]);
        context.strokeStyle = "#808080";
        context.strokeRect(5, 5, parentWidth - 10, parentHeight - 10);
    }

    function canvasBannerHover() {

        context.lineWidth = 5;
        context.setLineDash([12]);
        context.strokeStyle = "#808080";
        context.strokeRect(5, 5, parentWidth - 10, parentHeight - 10);
        context.font = "12px Arial";

        context.textAlign = "center";
        context.fillStyle = "#808080";
        context.fillText("Drop it!", context.canvas.width / 2, context.canvas.height / 2);

    }
}