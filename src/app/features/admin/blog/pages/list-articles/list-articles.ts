import { CommonModule } from '@angular/common';
import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FilterArticleDto } from '../../dto/filter-article.dto';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  Eye,
  EyeOff,
  LucideAngularModule,
  Plus,
  RefreshCcw,
  Search,
  SquarePen,
  Star,
  StarOff,
  Trash,
} from 'lucide-angular';
import { NgxPaginationModule } from 'ngx-pagination';
import { ConfirmationService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ApiImgPipe } from '@shared/pipes/api-img.pipe';
import { DeleteArticleStore } from '../../store/articles/delete-article.store';
import { ArticlesStore } from '../../store/articles/articles.store';
import { ConfirmPopup } from 'primeng/confirmpopup';
import { IArticle } from '@shared/models/entities.models';
import { HighlightArticleStore } from '../../store/articles/highlight-article.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-article-list',
  providers: [ConfirmationService, ArticlesStore, DeleteArticleStore, HighlightArticleStore],
  imports: [
    LucideAngularModule,
    CommonModule,
    ButtonModule,
    InputTextModule,
    ProgressSpinnerModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    RouterLink,
    AvatarModule,
    ApiImgPipe,
    ConfirmPopup,
  ],
  templateUrl: './list-articles.html',
})
export class ListArticles implements OnInit {
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #fb = inject(FormBuilder);
  #confirmationService = inject(ConfirmationService);
  searchForm: FormGroup;
  store = inject(ArticlesStore);
  deleteArticleStore = inject(DeleteArticleStore);
  highlightStore = inject(HighlightArticleStore);
  #destroyRef = inject(DestroyRef);
  skeletonArray = Array.from({ length: 100 }, (_, i) => i + 1);
  icons = {
    refresh: RefreshCcw,
    edit: SquarePen,
    trash: Trash,
    search: Search,
    plus: Plus,
    eye: Eye,
    eyeOff: EyeOff,
    star: Star,
    starOff: StarOff,
  };
  queryParams = signal<FilterArticleDto>({
    page: this.#route.snapshot.queryParamMap.get('page'),
    q: this.#route.snapshot.queryParamMap.get('q'),
  });

  constructor() {
    this.searchForm = this.#fb.group({
      q: [this.queryParams().q || ''],
    });
  }

  ngOnInit(): void {
    this.loadArticles();
    const searchInput = this.searchForm.get('q');
    searchInput?.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged(), takeUntilDestroyed(this.#destroyRef))
      .subscribe((searchValue: string) => {
        this.queryParams().q = searchValue ? searchValue.trim() : null;
        this.queryParams().page = null;
        this.updateRouteAndArticles();
      });
  }

  loadArticles(): void {
    this.store.loadArticles(this.queryParams());
  }

  onPageChange(currentPage: number): void {
    this.queryParams().page = currentPage === 1 ? null : currentPage.toString();
    this.updateRouteAndArticles().then();
  }

  async updateRoute(): Promise<void> {
    const queryParams = this.queryParams();
    await this.#router.navigate(['/dashboard/blog/articles'], { queryParams });
  }

  highlightArticle(articleId: string): void {
    this.highlightStore.highlight(articleId);
  }

  async updateRouteAndArticles(): Promise<void> {
    await this.updateRoute();
    this.loadArticles();
  }

  onDeleteArticle(articleId: string, article: Event): void {
    this.#confirmationService.confirm({
      target: article.currentTarget as EventTarget,
      message: 'Etes-vous sûr ?',
      rejectButtonProps: {
        label: 'Annuler',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Confirmer',
        severity: 'danger',
      },
      accept: () => {
        this.deleteArticleStore.deleteArticle(articleId);
      },
    });
  }

  isPublished(article: IArticle): boolean {
    return !!article.published_at && new Date(article.published_at) <= new Date();
  }
}
