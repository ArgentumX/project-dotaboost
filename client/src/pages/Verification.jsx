import Test from "../components/Test";
import TestQuestion from "../components/TestQuestion";

function Verification() {
    return (
        <div className="center">
            <Test>
                <h1>Ответьте на вопросы</h1>
                <TestQuestion title="Ты пидор?" opts={["Да", "Нет"]} />
                <TestQuestion title="Точно?" opts={["Конечно", "Нет", "Не уверен"]} />
            </Test>
        </div>
    );
}

export default Verification;
