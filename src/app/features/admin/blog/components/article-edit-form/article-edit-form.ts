import { Component, effect, inject, input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { QuillModule } from 'ngx-quill';
import { Calendar, Check, FileText, Info, List, PenLine, Tag, LucideAngularModule } from 'lucide-angular';
import { IArticle } from '@shared/models';
import { ArticlesStore } from '../../store/articles.store';

@Component({
  selector: 'app-article-edit-form',
  templateUrl: './article-edit-form.html',
  providers: [ArticlesStore],
  imports: [
    ReactiveFormsModule,
    SelectModule,
    MultiSelectModule,
    TextareaModule,
    DatePickerModule,
    InputText,
    Button,
    QuillModule,
    LucideAngularModule
  ]
})
export class ArticleEditFormComponent {
  article = input.required<IArticle>();
  #fb = inject(FormBuilder);
  updateStore = inject(ArticlesStore);
  form = this.#initForm();
  icons = {
    penLine: PenLine,
    tag: Tag,
    calendar: Calendar,
    list: List,
    fileText: FileText,
    info: Info,
    check: Check
  };

  #initForm(): FormGroup {
    return this.#fb.group({
      id: ['', Validators.required],
      title: ['', Validators.required],
      published_at: ['', Validators.required],
      content: ['', Validators.required],
      summary: ['', Validators.required],
      tags: [[], Validators.required]
    });
  }

  constructor() {
    effect(() => {
      this.#patchForm(this.article());
    });
    this.updateStore.loadTags();
  }

  #patchForm(article: IArticle): void {
    this.form.patchValue({
      ...article,
      published_at: new Date(article.published_at),
      tags: article.tags?.map((c) => c.id)
    });
  }

  onSubmit(): void {
    if (this.form.valid) this.updateStore.updateArticle(this.form.value);
  }
}
