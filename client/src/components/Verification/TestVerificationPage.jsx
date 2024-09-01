import Test from "./Test";
import TestQuestion from "./TestQuestion";

const TestVerificationPage = ({onChange, value, onSubmit}) => {   
    let question_index = 1;

    return (
        <div className="center">
            <Test>
                <h1 className="test-header"> Ответьте на вопросы</h1>
                <TestQuestion
                    id={(question_index++).toString()}
                    title="Ты пидор?"
                    opts={["Да", "Нет"]}
                    onChange={onChange}
                    value={value[question_index - 1]}
                />
                <TestQuestion
                    id={(question_index++).toString()}
                    title="Точно?"
                    opts={["Конечно", "Нет", "Не уверен"]}
                    onChange={onChange}
                    value={value[question_index - 1]}
                />
                <TestQuestion
                    id={(question_index++).toString()}
                    title="Ты пидор?"
                    opts={["Да", "Нет"]}
                    onChange={onChange}
                    value={value[question_index - 1]}
                />
                <TestQuestion
                    id={(question_index++).toString()}
                    title="Точно?"
                    opts={["Конечно", "Нет", "Не уверен"]}
                    onChange={onChange}
                    value={value[question_index - 1]}
                />
                <TestQuestion
                    id={(question_index++).toString()}
                    title="Ты пидор?"
                    opts={["Да", "Нет"]}
                    onChange={onChange}
                    value={value[question_index - 1]}
                />
                <TestQuestion
                    id={(question_index++).toString()}
                    title="Точно?"
                    opts={["Конечно", "Нет", "Не уверен"]}
                    onChange={onChange}
                    value={value[question_index - 1]}
                />
                <TestQuestion
                    id={(question_index++).toString()}
                    title="Ты пидор?"
                    opts={["Да", "Нет"]}
                    onChange={onChange}
                    value={value[question_index - 1]}
                />
                <TestQuestion
                    id={(question_index++).toString()}
                    title="Точно?"
                    opts={["Конечно", "Нет", "Не уверен"]}
                    onChange={onChange}
                    value={value[question_index - 1]}
                />
                <TestQuestion
                    id={(question_index++).toString()}
                    title="Ты пидор?"
                    opts={["Да", "Нет"]}
                    onChange={onChange}
                    value={value[question_index - 1]}
                />
                <TestQuestion
                    id={(question_index++).toString()}
                    title="Точно?"
                    opts={["Конечно", "Нет", "Не уверен"]}
                    onChange={onChange}
                    value={value[question_index - 1]}
                />
                <div className="test-footer">
                    <button onClick={() => onSubmit(question_index)}>Отправить</button>
                </div>
            </Test>
        </div>
    );
}

export default TestVerificationPage;