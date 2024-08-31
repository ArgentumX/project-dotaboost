import { useContext, useEffect, useState } from "react";
import Test from "../components/Test";
import TestQuestion from "../components/TestQuestion";
import { Context } from "..";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { MAINPAGE_ROUTE } from "../utils/consts";
import { setImageUploadSettings, toggleImageUpload } from "../components/ImageUpload";
import ExecutorTicketService from "../service/ExecutorTicketService";
import ReactLoading from "react-loading";

function Verification() {
    const [answers, setAnswers] = useState({});
    const [testCompleted, setTestCompleted] = useState(false);
    const [imageSent, setImageSent] = useState(false);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const { store } = useContext(Context);

    let question_index = 1;

    setImageUploadSettings(4, false, (screen) => {
        store.uploadScreenshot(screen);
        setImageSent(!imageSent);
    });

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
            setAnswers(ans);
            setTestCompleted(true);
        }
    }

    useEffect(() => {
        if (testCompleted) {
            window.scrollTo(0, 0);

            setLoading(true);
            ExecutorTicketService.create(answers).catch((e) => {
                setLoading(false);
            }).then(data => {
                store.setExecutorTicket(data?.ticket);
                if (!store.executorTicket) {
                    console.log(store.executorTicket)
                    swal({
                        title: "Тест не пройден.",
                        text: "",
                        icon: "error"
                    })
                        .then((value) => {
                            navigate(MAINPAGE_ROUTE);
                        })
                } else if (store.executorTicket) {
                    swal({
                        title: "Успех!",
                        button: "Продолжить верификацию.",
                        text: "Тест пройден.",
                    })
                }
                setLoading(false);
            })

        }
    }, [testCompleted])

    useEffect(() => {
        window.scrollTo(0, 0);

        setLoading(true);
        ExecutorTicketService.getUserTicket().catch((e) => {
            setLoading(false);
        }).then(data => {
            store.setExecutorTicket(data?.ticket);
            setLoading(false);
        })
    }, [imageSent])

    if (loading) {
        return (
            <div >
                <ReactLoading type="cylon" color="#696969" height={100} width={50} />
            </div>
        );
    }

    if (store.executorTicket?.requiredUsername && !store.executorTicket?.image) {
        return (
            <div className="center">
                <div className="verification-image-wrapper">
                    <h2>Следуйте указаниям для завершения верификации.</h2>
                    <h3>1. Вам присвоен уникальный никнейм: «<b>{store.executorTicket.requiredUsername}</b>». В настройках профиля в Вашем Steam аккаунте поставьте этот ник.</h3>
                    <h3>2. Запустите Dota 2 и перейдите в историю игр.</h3>
                    <h3>3. Сделайте скриншот всего экрана, как показано на примере ниже.</h3>
                    <img src="src/assets/img/verification-image-example.png" alt="" className="verification-example" />
                    <h3>4. Загрузите скриншот.</h3>
                    <div className="test-footer">
                        <button onClick={toggleImageUpload}>Загрузить</button>
                    </div>
                </div>
            </div>
        );
    }

    if (store.executorTicket?.image) {
        return (
            <div className="center">
                <p>
                    Вы уже отправили заявку на верификацию.
                    Статус заявки:  {store.executorTicket.verified ?
                        <b className="green">одобрена</b>
                        :
                        <b className="yellow">на рассмотрении</b>
                    }.
                </p>
            </div>
        );
    }

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
