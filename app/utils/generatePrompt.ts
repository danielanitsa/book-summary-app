export const generatePrompt = (
  bookname: string,
  author: string,
  isbn: number,
): string => {
  return `I need a detailed yet concise summary of the book title ${bookname} by ${author}, with ISBN: ${isbn} . Please focus on the main concepts, methodologies, and key takeaways. Structure the summary with clear headings for each section: Introduction, Core Concepts, Methodologies, and Key Takeaways. Aim for a length of 400-500 words. I’m short on time, so make it as informative and brief as possible, highlighting the most critical points. The flow of the summary should be like an essay with an educative and fun tone. Output your answer in markdown and not plain text.
## Example 1: *Atomic Habits by James Clear*

### Summary:
Atomic Habits by James Clear is a practical guide on how to build good habits and break bad ones. The core idea is that small changes can lead to remarkable results over time. Clear introduces the concept of the "1% rule," where making tiny improvements each day can lead to significant growth. He explains the four laws of behavior change: make it obvious, make it attractive, make it easy, and make it satisfying. The book is filled with actionable strategies, real-life examples, and scientific insights, emphasizing the importance of creating systems rather than setting goals. Clear also discusses the role of environment in shaping habits and the significance of identity in sustaining long-term changes.

#### Key Takeaways:

+  Small habits compound over time to create significant outcomes.

+  The Four Laws of Behavior Change can help in forming good habits and breaking bad ones.

+  Focus on systems and processes rather than just goals.

+  Environment and identity play crucial roles in habit formation.


## Example 2: *Thinking, Fast and Slow by Daniel Kahneman*

### Summary:
Thinking, Fast and Slow by Daniel Kahneman explores the dual systems of thought that drive the way we think. System 1 is fast, intuitive, and emotional, while System 2 is slower, more deliberative, and logical. Kahneman delves into the biases and errors in judgment that arise from the reliance on System 1, such as overconfidence, framing effects, and anchoring. He also discusses the concept of "loss aversion," where losses are felt more intensely than gains. The book combines psychological insights with economic theories, offering a profound understanding of human decision-making processes and how we can improve them.

#### Key Takeaways:

+  Human thinking is governed by two systems: fast and slow.

+  Cognitive biases often result from the quick judgments of System 1.

+  Awareness of these biases can improve decision-making.

+  Loss aversion significantly impacts our choices and risk assessments.


## **Example 3: Sapiens: A Brief History of Humankind by Yuval Noah Harari**

### Summary:
Sapiens by Yuval Noah Harari traces the history of the human species from the emergence of Homo sapiens in the Stone Age to the present. Harari examines how cognitive, agricultural, and scientific revolutions have shaped human societies and the environment. He argues that our ability to create and believe in shared myths, such as religions, nations, and money, has allowed for large-scale cooperation and societal development. The book also addresses the impact of capitalism, imperialism, and technological advancements on human life and raises questions about the future trajectory of our species.

#### Key Takeaways:

+  Human history has been shaped by cognitive, agricultural, and scientific revolutions.

+  Shared myths enable large-scale human cooperation.

+  Capitalism and technological advancements have profoundly influenced modern societies.

+  The future of Homo sapiens involves critical ethical and existential questions.


## **Example 4: The Lean Startup by Eric Ries**

### Summary:
The Lean Startup by Eric Ries introduces a new approach to business that maximizes efficiency and adaptability. The methodology centers around continuous innovation and validated learning through a Build-Measure-Learn feedback loop. Ries emphasizes the importance of creating a minimum viable product (MVP) to test hypotheses quickly and gather customer feedback. By using metrics and pivoting based on real-world data, startups can reduce waste and increase their chances of success. The book provides practical tools for entrepreneurs to manage risk, optimize resources, and develop sustainable business models.

#### Key Takeaways:

+  Continuous innovation and validated learning are key to startup success.

+  The Build-Measure-Learn feedback loop helps test ideas quickly.

+  Minimum viable products (MVPs) are essential for gathering early customer feedback.

+  Data-driven decisions and pivoting can optimize resources and reduce waste.`;
};
