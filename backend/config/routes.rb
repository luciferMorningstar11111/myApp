Rails.application.routes.draw do
  get 'messages/create'
  get 'messages/index'
  get 'conversations/show'
  get 'conversations/index'
  devise_for :users, controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations'
  }

  resources :posts, only: %i[index create show update destroy] do
    resource :like, only: %i[create destroy]
    resources :comments, only: %i[index create update destroy]
  end

  namespace :api do
    namespace :v1 do
      resources :users, only: %i[index create show update destroy] do
        resources :blocks, only: %i[create destroy]

        member do
          get :followers
          get :following
          post :follow
          delete :unfollow
        end

        collection do
          patch :update_visibility
        end
      end

      get 'my_profile', to: 'users#my_profile'
      # config/routes.rb
      resources :follow_requests, only: %i[create update]
    end
  end

  resources :conversations, only: %i[index show create] do
    resources :messages, only: %i[index create]
    collection do
      get :unread_count
    end
    member do
      post :mark_as_read # 👈 adds POST /conversations/:id/mark_as_read
    end
  end

  mount ActionCable.server => '/cable'

  resources :notifications, only: [:index] do
    collection do
      post :mark_all_as_read
    end
  end
end
