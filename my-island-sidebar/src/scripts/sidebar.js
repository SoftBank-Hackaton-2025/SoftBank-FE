// ...existing code...
document.addEventListener('DOMContentLoaded', () => {
    const steps = Array.from(document.querySelectorAll('.step'));
    let idx = 0;

    function setActive(i) {
        steps.forEach((s, j) => s.classList.toggle('active', j === i));
        idx = i;
    }

    steps.forEach((step, i) => {
        step.addEventListener('click', () => setActive(i));
    });

    document.getElementById('prev').addEventListener('click', () => setActive(Math.max(0, idx - 1)));
    document.getElementById('next').addEventListener('click', () => setActive(Math.min(steps.length - 1, idx + 1)));

    setActive(0);
});
// ...existing code...