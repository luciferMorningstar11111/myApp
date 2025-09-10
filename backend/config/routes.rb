Rails.application.routes.draw do
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
    end
  end

  resources :notifications, only: [:index] do
    collection do
      post :mark_all_as_read
    end
  end
end
