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

        uploadImg.src = "https://img.icons8.com/metro/52/000000/upload-to-cloud.png";

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