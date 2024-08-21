import { useContext, useState } from "react";
import { toggleBlur } from "./ActivatePrompt";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import 'react-image-crop/dist/ReactCrop.css'
import { useDropzone } from "react-dropzone";
import { Context } from ".."

function ImageUpload() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [crop, setCrop] = useState();
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const formData = new FormData();

    const {store} = useContext(Context);

    const fileValidation = (file) => {
        const allowedExtensions = 
            /(\.jpg|\.jpeg|\.png|\.gif)$/i;

        if (!allowedExtensions.exec(file.path)) {
            alert("Данный тип файла не поддерживается.")
            return false;
        }

        if (file.size >= 1000000) {
            alert("Изображение слишком велико. Максимальный размер: 1Мб.");
            return false;
        }
        if (file.size <= 15000){
            alert("Изображение слишком маленькое.");
            return false;
        }

        return true;
    }

    const uploadFile = (file) => {
        setIsImageLoaded(false)
        if (fileValidation(file)) {
            setSelectedImage(file);
        }
    }

    const onDrop = (acceptedFiles) => {uploadFile(acceptedFiles[0])};

    const {acceptedFiles, getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        noClick: true,
        noKeyboard: true,
    });
    
    function dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type:mime});
    }

    const createImageFromCrop = () => {
        const image = document.getElementById("image");

        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        const pixelRatio = window.devicePixelRatio;
        canvas.width = crop.width * pixelRatio;
        canvas.height = crop.height * pixelRatio;
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height,
        );

        var outputImage = canvas.toDataURL('image/jpeg');
        outputImage = dataURLtoFile(outputImage, "avatar.jpeg");

        return outputImage;
    }

    function onImageLoad(e) {
        const { naturalWidth: width, naturalHeight: height } = e.currentTarget

        const crop = centerCrop(
            makeAspectCrop(
                {
                    unit: '%',
                    width: 20,
                },
                1,
                width,
                height
            ),
            width,
            height
        )
        console.log("a")
        setIsImageLoaded(true)
        setCrop(crop)
    }

    return (
        <div id="ImageUpload">
            <div className="ImageUploadHeader">
                <h1>Аватар</h1>
                <img src="src/assets/img/close.png" alt="" className="close" role="button" onClick={()=> {
                    toggleImageUpload();
                    setTimeout(() => {
                        setSelectedImage(null);
                    }, 500)
                }}/> 
            </div>
            <div className={isDragActive ? "ImageContainer drag" : "ImageContainer"} {...getRootProps()}> 
                {selectedImage && (
                    <ReactCrop crop={crop} onChange={c => setCrop(c)} circularCrop={true} aspect={1} keepSelection={true}>
                        <img id="image" src={URL.createObjectURL(selectedImage)} onLoad={!isImageLoaded ? onImageLoad : null} />
                    </ReactCrop>
                )}
                {!selectedImage && (
                    <div className="hint">
                        <img src="src/assets/img/img.png" alt=""/>
                        <h3>Переместите изображение сюда</h3>    
                    </div>
                )}
                <input type="file" id="avatar" {...getInputProps()}/>
            </div>
            <div className="ImageUploadFooter">
                <label htmlFor="avatar" id="load">Загрузить</label>
                <button className="submit" onClick={() => { crop ? 
                        (
                            formData.append('image', createImageFromCrop()),
                            store.uploadAvatar(formData),
                            setCrop(null),
                            setSelectedImage(null),
                            toggleImageUpload()
                        )
                        : null 
                        }}>Сохранить</button>
            </div>
        </div>
    );
}

export function toggleImageUpload(){
    toggleBlur();
    document.getElementById('ImageUpload').classList.toggle('active');
}

export default ImageUpload;
