import { toggleBlur } from "./ActivatePrompt";

function ImageUpload() {
    return (
        <div id="ImageUpload">
            <div className="ImageUploadHeader">
                <h1>Аватар</h1>
                <img src="src/assets/img/close.png" alt="" className="close" role="button" onClick={toggleImageUpload}/> 
            </div>
            <div className="HintImageContainer">
                <img src="src/assets/img/img.png" alt=""/>
                <h3>Переместите изображение сюда</h3>
            </div>
            <div className="ImageUploadFooter">
                <button className="load">Загрузить</button>
                <button className="submit">Сохранить</button>
            </div>
        </div>
    );
}

export function toggleImageUpload(){
    toggleBlur();
    document.getElementById('ImageUpload').classList.toggle('active');
}

export default ImageUpload;
