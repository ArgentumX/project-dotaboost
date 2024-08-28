function TestQuestion(props) {
    console.log(props.opts);
    return (
        <div className="test-question">
            <h2 className="test-question-title">{props.title}</h2>
            <ul className="test-question-asnwers-list">
                {props.opts.map((opt) => {
                    return (
                        <li key={opt }className="test-question-answer">{opt}</li>
                    );
                })}
            </ul>
        </div>
    );
}

export default TestQuestion;
