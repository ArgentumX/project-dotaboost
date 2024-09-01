import { useContext, useState } from "react";
import { toggleBlur } from "../../utils/blur";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import 'react-image-crop/dist/ReactCrop.css'
import { useDropzone } from "react-dropzone";
import { Context } from "../.."

export let maxSizeMB = 1;
export let isCrop = true;
export let onSubmit = {};

const MB = 1000000;

export function setImageUploadSettings(_maxSizeMB, _isCrop, _onSubmit) {
    maxSizeMB = _maxSizeMB;
    isCrop = _isCrop;
    onSubmit = _onSubmit;
}

export function toggleImageUpload() {
    toggleBlur();
    document.getElementById('ImageUpload').classList.toggle('active');
}

function ImageUpload() {
    const { store } = useContext(Context);
    const [selectedImage, setSelectedImage] = useState(null);
    const [crop, setCrop] = useState();
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [file, setFile] = useState();
    const formData = new FormData();

    const fileValidation = (file) => {
        const allowedExtensions =
            /(\.jpg|\.jpeg|\.png|\.gif)$/i;

        if (!allowedExtensions.exec(file.path)) {
            swal({
                title: "Ошибка",
                text: "Данный тип файла не поддерживается.",
                icon: "error"
            })
            return false;
        }

        if (file.size >= maxSizeMB * MB) {
            swal({
                title: "Ошибка",
                text: `Изображение слишком велико. Максимальный размер: ${maxSizeMB}Мб.`,
                icon: "error"
            })
            return false;
        }
        if (file.size <= 15000) {
            swal({
                title: "Ошибка",
                text: "Изображение слишком маленькое.",
                icon: "error"
            })
            return false;
        }

        return true;
    }

    const uploadFile = (selectedFile) => {
        setIsImageLoaded(false)
        if (fileValidation(selectedFile)) {
            const jpeg = new File([selectedFile], 'image.jpeg', {type: 'image/jpeg'});
            setSelectedImage(jpeg);
        }
    }

    const onDrop = (acceptedFiles) => {
        const selectedFile = acceptedFiles[0];
        setFile(selectedFile);
        uploadFile(selectedFile);
    };

    const { acceptedFiles, getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        noClick: true,
        noKeyboard: true,
    });

    function dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
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
        const { width, height } = e.currentTarget

        const crop = makeAspectCrop(
            {
                unit: "px",
                width: 50,
            },
            1,
            width,
            height
        );

        const centeredCrop = centerCrop(crop, width, height);
        setCrop(centeredCrop);
        setIsImageLoaded(true);
    }

    const handleSubmitClick = () => {
        onSubmit = onSubmit.bind(store);

        if (isCrop && crop) {
            formData.append('image', createImageFromCrop());
            onSubmit(formData);
            setCrop();
            setSelectedImage();
            toggleImageUpload();
            document.getElementById('avatar').value = null;
            setFile();
            return;
        }

        if (!isCrop) {
            formData.append('image', selectedImage);
            onSubmit(formData);
            setSelectedImage();
            toggleImageUpload();
            document.getElementById('avatar').value = null;
            setFile();
            return;
        }
    }

    return (
        <div id="ImageUpload">
            <div className="ImageUploadHeader">
                <h1>Загрузка изображения</h1>
                <img src="src/assets/img/close.png" alt="" className="close" role="button" onClick={() => {
                    toggleImageUpload();
                    setTimeout(() => {
                        setSelectedImage(null);
                    }, 500)
                }} />
            </div>
            <div className={isDragActive ? "ImageContainer drag" : "ImageContainer"} {...getRootProps()}>
                {selectedImage && (
                    <ReactCrop
                        crop={isCrop ? crop : null}
                        onChange={isCrop ? c => setCrop(c) : null}
                        circularCrop={true}
                        aspect={1}
                        keepSelection={true}
                        disabled={!isCrop}
                    >
                        <img
                            id="image"
                            src={URL.createObjectURL(selectedImage)}
                            onLoad={!isImageLoaded ? onImageLoad : null}
                        />
                    </ReactCrop>
                )}
                {!selectedImage && (
                    <div className="hint">
                        <img src="src/assets/img/img.png" alt="" />
                        <h3>Переместите изображение сюда</h3>
                    </div>
                )}
                <input type="file" id="avatar" {...getInputProps()} />
            </div>
            <div className="ImageUploadFooter">
                <label htmlFor="avatar" id="load">Выбрать</label>
                <button className="submit" onClick={handleSubmitClick}>Сохранить</button>
            </div>
        </div>
    );
}

export default ImageUpload;
