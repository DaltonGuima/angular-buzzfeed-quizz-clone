import { Component, OnInit } from '@angular/core';
import quizz_questions from "../../../assets/data/quizz_questions.json";

@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.component.html',
  styleUrls: ['./quizz.component.css']
})
export class QuizzComponent implements OnInit {
  title: string = "";
  questions: any;
  questionSelected: any;
  answers: string[] = [];
  answerSelected: string = "";
  questionIndex: number = 0;
  questionMaxIndex: number = 0;
  finished: boolean = false;

  constructor() { }

  ngOnInit(): void {
    if (quizz_questions) {
      this.initializeQuiz();
    }
  }

  initializeQuiz(): void {
    this.finished = false;
    this.title = quizz_questions.title;
    this.questions = quizz_questions.questions;
    this.questionSelected = this.questions[this.questionIndex];
    this.questionMaxIndex = this.questions.length;
  }

  playerChoose(value: string): void {
    this.answers.push(value);
    this.nextStep();
  }

  async nextStep(): Promise<void> {
    this.questionIndex += 1;

    if (this.questionIndex < this.questionMaxIndex) {
      this.questionSelected = this.questions[this.questionIndex];
    } else {
      const finalAnswer: string = await this.checkResult(this.answers);
      this.finished = true;
      this.answerSelected = quizz_questions.results[finalAnswer as keyof typeof quizz_questions.results];
    }
  }

  async checkResult(answers: string[]): Promise<string> {
    const result = answers.reduce((previous, current, i, arr) => {
      const previousCount = arr.filter(item => item === previous).length;
      const currentCount = arr.filter(item => item === current).length;
      return previousCount > currentCount ? previous : current;
    });

    return result;
  }
}