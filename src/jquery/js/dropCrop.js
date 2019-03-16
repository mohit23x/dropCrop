function mainCrop(divid, canvasid, cropid, resetid, inputid, resultid, aspectRatio) {
  var parentDiv = $("#" + divid);

  const parentHeight = parentDiv.innerHeight();
  const parentWidth = parentDiv.width();
  var result = $("#" + resultid);
  var canvas = $('#' + canvasid);
  var inputField = $('#' + inputid);
  var context = canvas.get(0).getContext("2d");


  canvasBanner();

  var droppedFiles = false

  canvas.on('drag dragstart dragend dragover dragleave drop', function(e) {
          e.preventDefault();
          e.stopPropagation();
      })
      .on('dragover dragenter hover', function() {
          canvas.cropper('clear');
          canvas.cropper('destroy');
          context.clearRect(0, 0, context.canvas.width, context.canvas.height);
          context.canvas.height = parentHeight;
          context.canvas.width = parentWidth;
          canvasBannerHover();
      })
      .on('dragleave dragend', function() {
          canvasBanner();
      })
      .on('drop', function(e) {
          droppedFiles = e.originalEvent.dataTransfer.files;
          cropWorker(droppedFiles[0]);
      })
      .on('click', function(e) {
          inputField.click();
          inputField.change(function(e) {
              var file = e.target.files[0];
              cropWorker(file);
          })
      });

  $('#'+cropid).click(async function() {

      var croppedImage = await canvas.cropper('getCroppedCanvas').toDataURL("image/png");


      var cropImg = new Image();
      cropImg.onload = function() {
          context.canvas.height = cropImg.height;
          context.canvas.width = cropImg.width;
          context.drawImage(cropImg, 0, 0);
      }
      result.attr('src', croppedImage);
      canvas.cropper('destroy');
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      cropImg.src = croppedImage;

  });


  $('#'+resetid).click(function() {
      canvas.cropper('clear');
      canvas.cropper('destroy');
      canvasBanner();
  })

  function cropWorker(x) {

      var reader = new FileReader();
      reader.onload = function(evt) {
          var img = new Image();
          img.onload = function() {
              context.canvas.height = img.height;
              context.canvas.width = img.width;
              context.drawImage(img, 0, 0);
              var cropper = canvas.cropper({
                  aspectRatio: aspectRatio
              });
          };
          img.src = evt.target.result;
      };
      reader.readAsDataURL(x);
  }


  function canvasBanner() {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      context.canvas.height = parentHeight;
      context.canvas.width = parentWidth;

      var uploadImg = new Image();
      uploadImg.onload = function() {
          uploadImg.height = "10px";
          uploadImg.width = "10px";
          context.drawImage(uploadImg, context.canvas.width / 2 - 25, context.canvas.height / 2 - 50, 50, 50);
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