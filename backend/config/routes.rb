Rails.application.routes.draw do
 devise_for :users, controllers: {
        sessions: 'users/sessions',
        registrations: 'users/registrations'
      } 

resources :posts, only: [:index,  :create,:show, :update , :destroy]
namespace :api do
  namespace :v1 do
    resources :users, only: [:index,  :create,:show, :update , :destroy] do
     member do
           get :followers
        get :following
        post :follow
        delete :unfollow
  end
  end
end
end


end
