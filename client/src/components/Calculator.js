function Calculator(
    startMMR,
    endMMR,
    party,
    priority,
    steamguard,
    time,
) {
    if (startMMR > endMMR) {
        return "0.00";
    }

    const partyMultiplier = party ? 1.2 : 1;
    const priorityMultiplier = priority ? 1.3 : 1;
    const steamguardMultiplier = steamguard ? 1.4 : 1;
    let timeMultiplier = 1;

    if (time[3]) {
        timeMultiplier += 0.2;
    }

    if (time[2]) {
        timeMultiplier += 0.1;
    }

    if (time[1]) {
        timeMultiplier += 0.1;
    }

    if (time[0]) {
        timeMultiplier += 0.2;
    }

    if (time[0] && time[1] && time[2] && time[3]) {
        timeMultiplier = 1;
    }

    let cost = (endMMR - startMMR) * partyMultiplier * priorityMultiplier * steamguardMultiplier * timeMultiplier;

    return cost.toFixed(2);
}

export default Calculator; 
