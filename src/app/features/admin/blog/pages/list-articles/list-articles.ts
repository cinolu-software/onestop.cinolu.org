import { CommonModule } from '@angular/common';
import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FilterArticleDto } from '../../dto/filter-article.dto';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  Eye,
  EyeOff,
  FileX,
  Funnel,
  LucideAngularModule,
  Plus,
  RefreshCcw,
  Search,
  Sparkles,
  SquarePen,
  Star,
  StarOff,
  Trash
} from 'lucide-angular';
import { NgxPaginationModule } from 'ngx-pagination';
import { ConfirmationService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ApiImgPipe } from '@shared/pipes/api-img.pipe';
import { ArticlesStore } from '../../store/articles.store';
import { ConfirmPopup } from 'primeng/confirmpopup';
import { IArticle } from '@shared/models/entities.models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Tabs } from '@shared/components/tabs/tabs';

@Component({
  selector: 'app-article-list',
  providers: [ConfirmationService, ArticlesStore],
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
    Tabs
  ],
  templateUrl: './list-articles.html'
})
export class ListArticles implements OnInit {
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #fb = inject(FormBuilder);
  #confirmationService = inject(ConfirmationService);
  searchForm: FormGroup;
  store = inject(ArticlesStore);
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
    fileX: FileX,
    filter: Funnel,
    sparkles: Sparkles
  };
  queryParams = signal<FilterArticleDto>({
    page: this.#route.snapshot.queryParamMap.get('page'),
    q: this.#route.snapshot.queryParamMap.get('q'),
    filter: (this.#route.snapshot.queryParamMap.get('filter') as FilterArticleDto['filter']) || 'all'
  });
  activeTab = signal<string>(
    (this.#route.snapshot.queryParamMap.get('filter') as 'all' | 'published' | 'drafts' | 'highlighted') || 'all'
  );
  tabsConfig = signal([
    { name: 'all', label: 'Tous' },
    { name: 'published', label: 'Publiés' },
    { name: 'drafts', label: 'Brouillons' },
    { name: 'highlighted', label: 'En vedette' }
  ]);

  constructor() {
    this.searchForm = this.#fb.group({
      q: [this.queryParams().q || '']
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

  onTabChange(tabName: string): void {
    this.activeTab.set(tabName);
    this.queryParams().filter = tabName as FilterArticleDto['filter'];
    this.queryParams().page = null;
    this.updateRouteAndArticles();
  }

  onPageChange(currentPage: number): void {
    this.queryParams().page = currentPage === 1 ? null : currentPage.toString();
    this.updateRouteAndArticles().then();
  }

  async updateRoute(): Promise<void> {
    const queryParams = this.queryParams();
    await this.#router.navigate(['/blog/articles'], { queryParams });
  }

  highlightArticle(articleId: string): void {
    this.store.highlight(articleId);
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
        outlined: true
      },
      acceptButtonProps: {
        label: 'Confirmer',
        severity: 'danger'
      },
      accept: () => {
        this.store.deleteArticle(articleId);
      }
    });
  }

  isPublished(article: IArticle): boolean {
    return !!article.published_at && new Date(article.published_at) <= new Date();
  }
}
