Rails.application.routes.draw do
 devise_for :users, controllers: {
        sessions: 'users/sessions',
        registrations: 'users/registrations'
      } 

resources :posts, only: [:index,  :create,:show, :update , :destroy]
namespace :api do
  namespace :v1 do
    resources :users, only: [:index,  :create,:show, :update , :destroy] do
      resources :blocks, only: [:create, :destroy]
     
      member do
           get :followers
        get :following
        post :follow
        delete :unfollow
     end
   end
  get 'my_profile', to: 'users#my_profile'
  end
end


end
