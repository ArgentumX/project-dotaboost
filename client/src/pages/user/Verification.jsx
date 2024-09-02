import { useContext, useEffect, useState } from "react";
import { Context, root } from "../..";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { MAINPAGE_ROUTE } from "../../utils/consts";
import { setImageUploadSettings, toggleImageUpload } from "../../components/ImageUpload/ImageUpload";
import ExecutorTicketService from "../../service/ExecutorTicketService";
import ReactLoading from "react-loading";
import TestVerificationPage from "../../components/Verification/TestVerificationPage";
import ImageVerificationPage from "../../components/Verification/ImageVerificationPage";
import StatusVerificationPage from "../../components/Verification/StatusVerificationPage";


function Verification() {
    const [answers, setAnswers] = useState({});
    const [testCompleted, setTestCompleted] = useState(false);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const { executorStore } = useContext(Context);

    setImageUploadSettings(4, false, async (screen) => {
        executorStore.uploadScreenshot(screen);
        window.scrollTo(0, 0);
        setLoading(true);
        ExecutorTicketService.getUserTicket().catch((e) => {
            setLoading(false);
        }).then((data) => {
            executorStore.setExecutorTicket(data.ticket);
            setLoading(false);
        })
    });

    const handleAnswersChange = (id, value) => {
        setAnswers({ ...answers, [id]: value });
    }

    const handleTestSubmit = (question_index) => {
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
        setLoading(true);
        ExecutorTicketService.getUserTicket().catch((e) => {
            setLoading(false);
        }).then(data => {
            executorStore.setExecutorTicket(data?.ticket);
            setLoading(false);
        })
    }, [])

    useEffect(() => {
        if (testCompleted) {
            window.scrollTo(0, 0);

            setLoading(true);
            ExecutorTicketService.create(answers).catch((e) => {
                setLoading(false);
            }).then(data => {
                executorStore.setExecutorTicket(data?.ticket);
                if (!executorStore.executorTicket) {
                    console.log(executorStore.executorTicket)
                    swal({
                        title: "Тест не пройден.",
                        text: "",
                        icon: "error"
                    })
                        .then((value) => {
                            navigate(MAINPAGE_ROUTE);
                        })
                } else if (executorStore.executorTicket) {
                    swal({
                        title: "Успех!",
                        button: "Продолжить верификацию",
                        text: "Тест пройден",
                    })
                    .then((value) => {
                        setLoading(false);
                    })
                }
                setLoading(false);
            })

        }
    }, [testCompleted])

    if (loading) {
        return (
            <div >
                <ReactLoading type="cylon" color="#696969" height={100} width={50} />
            </div>
        );
    }

    if (executorStore.executorTicket?.requiredUsername && !executorStore.executorTicket?.image) {
        return (
            <ImageVerificationPage
                onSubmit={toggleImageUpload}
            />
        );
    }

    if (executorStore.executorTicket?.image) {
        return (
            <StatusVerificationPage />
        );
    }

    return (
        <TestVerificationPage 
            onChange={handleAnswersChange} 
            onSubmit={handleTestSubmit}
            value={answers}
        />
    );
}

export default observer(Verification);
