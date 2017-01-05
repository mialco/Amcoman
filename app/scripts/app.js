'use strict';

angular.module('confusionApp', ['ui.router','ngResource','ngDialog'])
.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
        
            // route for the home page
            .state('app', {
                url:'/',
                views: {
                    'header': {
                        templateUrl : 'views/header.html',
                        controller  : 'HeaderController'
                    },
                    'content': {
                        templateUrl : 'views/home.html',
                        controller  : 'HomeController'
                    },
                    'footer': {
                        templateUrl : 'views/footer.html',
                    }
                }

            })
        
            // route for the aboutus page
            .state('app.aboutus', {
                url:'aboutus',
                views: {
                    'content@': {
                        templateUrl : 'views/aboutus.html',
                        controller  : 'AboutController'                  
                    }
                }
            })
        
            // route for the contactus page
            .state('app.contactus', {
                url:'contactus',
                views: {
                    'content@': {
                        templateUrl : 'views/contactus.html',
                        controller  : 'ContactController'                  
                    }
                }
            })

            // route for the menu page
            .state('app.menu', {
                url: 'menu',
                views: {
                    'content@': {
                        templateUrl : 'views/menu.html',
                        controller  : 'MenuController'
                    }
                }
            })

            // route for the dishdetail page
            .state('app.dishdetails', {
                url: 'menu/:id',
                views: {
                    'content@': {
                        templateUrl : 'views/dishdetail.html',
                        controller  : 'DishDetailController'
                   }
                }
            })
        
            // route for the dishdetail page
            .state('app.orgs', {
                url: 'admin/orgs',
                views: {
                    'content@': {
                        templateUrl : 'views/organizations.html',
                        controller  : 'OrganizationController'
                   }
                }
            })

            // route for the dishdetail page
            .state('app.orgDetails', {
                url: 'admin/orgs/details?orgId',
                views: {
                    'content@': {
                        templateUrl: 'views/organizationDetails.html',
                        controller: 'OrganizationDetailController'
                    }
                }
            })

            // route for the dishdetail page
            .state('app.entities', {
                url: 'admin/entities',
                views: {
                    'content@': {
                        templateUrl : 'views/entities.html',
                        controller  : 'EntityController'
                   }
                }
            })

            // route for the dishdetail page
            .state('app.articles', {
                url: 'admin/articles',
                views: {
                    'content@': {
                        templateUrl : 'views/articles.html',
                        controller  : 'ArticleController'
                   }
                }
            })

            // route for the dishdetail page
            .state('app.favorites', {
                url: 'favorites',
                views: {
                    'content@': {
                        templateUrl : 'views/favorites.html',
                        controller  : 'FavoriteController'
                   }
                }
            });
    
        $urlRouterProvider.otherwise('/');
    })
;
