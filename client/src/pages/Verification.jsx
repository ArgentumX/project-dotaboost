import { useContext, useEffect, useRef, useState } from "react";
import Test from "../components/Test";
import TestQuestion from "../components/TestQuestion";
import { Context } from "..";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { MAINPAGE_ROUTE } from "../utils/consts";

function Verification() {
    const [answers, setAnswers] = useState({});
    const navigate = useNavigate();
    const { store } = useContext(Context);
    const firstRender = useRef(true);
    let question_index = 1;

    const handleAnswersChange = (id, value) => {
        setAnswers({ ...answers, [id]: value });
    }

    const handleTestSubmit = () => {
        if (Object.keys(answers).length != question_index - 1) {
            swal({
                title: "Ошибка",
                text: "Ответьте на все вопросы.",
                icon: "error"
            })
        } else {
            // --- DEBUG ---
            const ans = {
                "1": "ans1",
                "2": "ans2",
                "3": "ans3",
                "4": "ans4",
                "5": "ans5"
            }
            /// --- DEBUG ---
            store.createTicket(ans);
            //store.createTicket(answers);
        }
    }

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }

        if (!store.isTestPassed) {
            swal({
                title: "Тест не пройден.",
                text: "",
                icon: "error"
            })
                .then((value) => {
                    navigate(MAINPAGE_ROUTE);
                })
        } else if (store.isTestPassed) {
            swal({
                title: "Успех!",
                button: "Продолжить верификацию.",
                text: "Тест пройден.",
            })
                .then((value))
        }
    }, [store.isTestPassed])

    return (
        <div className="center">
            <Test>
                <h1 className="test-header"> Ответьте на вопросы</h1>
                <TestQuestion
                    id={(question_index++).toString()}
                    title="Ты пидор?"
                    opts={["Да", "Нет"]}
                    onChange={handleAnswersChange}
                    value={answers[question_index - 1]}
                />
                <TestQuestion
                    id={(question_index++).toString()}
                    title="Точно?"
                    opts={["Конечно", "Нет", "Не уверен"]}
                    onChange={handleAnswersChange}
                    value={answers[question_index - 1]}
                />
                <TestQuestion
                    id={(question_index++).toString()}
                    title="Ты пидор?"
                    opts={["Да", "Нет"]}
                    onChange={handleAnswersChange}
                    value={answers[question_index - 1]}
                />
                <TestQuestion
                    id={(question_index++).toString()}
                    title="Точно?"
                    opts={["Конечно", "Нет", "Не уверен"]}
                    onChange={handleAnswersChange}
                    value={answers[question_index - 1]}
                />
                <TestQuestion
                    id={(question_index++).toString()}
                    title="Ты пидор?"
                    opts={["Да", "Нет"]}
                    onChange={handleAnswersChange}
                    value={answers[question_index - 1]}
                />
                <TestQuestion
                    id={(question_index++).toString()}
                    title="Точно?"
                    opts={["Конечно", "Нет", "Не уверен"]}
                    onChange={handleAnswersChange}
                    value={answers[question_index - 1]}
                />
                <TestQuestion
                    id={(question_index++).toString()}
                    title="Ты пидор?"
                    opts={["Да", "Нет"]}
                    onChange={handleAnswersChange}
                    value={answers[question_index - 1]}
                />
                <TestQuestion
                    id={(question_index++).toString()}
                    title="Точно?"
                    opts={["Конечно", "Нет", "Не уверен"]}
                    onChange={handleAnswersChange}
                    value={answers[question_index - 1]}
                />
                <TestQuestion
                    id={(question_index++).toString()}
                    title="Ты пидор?"
                    opts={["Да", "Нет"]}
                    onChange={handleAnswersChange}
                    value={answers[question_index - 1]}
                />
                <TestQuestion
                    id={(question_index++).toString()}
                    title="Точно?"
                    opts={["Конечно", "Нет", "Не уверен"]}
                    onChange={handleAnswersChange}
                    value={answers[question_index - 1]}
                />
                <div className="test-footer">
                    <button onClick={handleTestSubmit}>Отправить</button>
                </div>
            </Test>
        </div>
    );
}

export default observer(Verification);
