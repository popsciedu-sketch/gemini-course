(function () {
  function grade(quiz) {
    const name = quiz.dataset.quiz;
    const correct = quiz.dataset.answer;
    const picked = quiz.querySelector('input[name="' + name + '"]:checked');
    const feedback = quiz.querySelector(".feedback");
    const labels = quiz.querySelectorAll("label");
    labels.forEach((l) => l.classList.remove("correct", "wrong"));
    if (!picked) {
      feedback.className = "feedback show bad";
      feedback.textContent = "請先選一個答案。";
      return;
    }
    const val = picked.value;
    labels.forEach((l) => {
      const input = l.querySelector("input");
      if (input.value === correct) l.classList.add("correct");
      else if (input.value === val) l.classList.add("wrong");
    });
    if (val === correct) {
      feedback.className = "feedback show ok";
      feedback.textContent = quiz.dataset.ok || "正確！";
      const data = JSON.parse(localStorage.getItem("gemini-course-quiz-v1") || "{}");
      data[name] = true;
      localStorage.setItem("gemini-course-quiz-v1", JSON.stringify(data));
    } else {
      feedback.className = "feedback show bad";
      feedback.textContent = quiz.dataset.bad || "再想一下，看看提示後重試。";
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".quiz").forEach((quiz) => {
      const btn = quiz.querySelector("[data-check]");
      if (btn) btn.addEventListener("click", () => grade(quiz));
    });
  });
})();
