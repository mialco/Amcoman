'use strict';

angular.module('amcomanApp')

.controller('MenuController', ['$scope', 'menuFactory', 'favoriteFactory', function ($scope, menuFactory, favoriteFactory) {

    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;
    $scope.showFavorites = false;
    $scope.showMenu = false;
    $scope.message = "Loading ...";

    menuFactory.query(
        function (response) {
            $scope.dishes = response;
            $scope.showMenu = true;

        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        });

    $scope.select = function (setTab) {
        $scope.tab = setTab;

        if (setTab === 2) {
            $scope.filtText = "appetizer";
        } else if (setTab === 3) {
            $scope.filtText = "mains";
        } else if (setTab === 4) {
            $scope.filtText = "dessert";
        } else {
            $scope.filtText = "";
        }
    };

    $scope.isSelected = function (checkTab) {
        return ($scope.tab === checkTab);
    };

    $scope.toggleDetails = function () {
        $scope.showDetails = !$scope.showDetails;
    };

    $scope.toggleFavorites = function () {
        $scope.showFavorites = !$scope.showFavorites;
    };

    $scope.addToFavorites = function (dishid) {
        console.log('Add to favorites', dishid);
        favoriteFactory.save({ _id: dishid });
        $scope.showFavorites = !$scope.showFavorites;
    };
}])

.controller('ContactController', ['$scope', 'feedbackFactory', function ($scope, feedbackFactory) {

    $scope.feedback = {
        mychannel: "",
        firstName: "",
        lastName: "",
        agree: false,
        email: ""
    };

    var channels = [{
        value: "tel",
        label: "Tel."
    }, {
        value: "Email",
        label: "Email"
    }];

    $scope.channels = channels;
    $scope.invalidChannelSelection = false;

    $scope.sendFeedback = function () {


        if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
            $scope.invalidChannelSelection = true;
        } else {
            $scope.invalidChannelSelection = false;
            feedbackFactory.save($scope.feedback);
            $scope.feedback = {
                mychannel: "",
                firstName: "",
                lastName: "",
                agree: false,
                email: ""
            };
            $scope.feedback.mychannel = "";
            $scope.feedbackForm.$setPristine();
        }
    };
}])

.controller('DishDetailController', ['$scope', '$state', '$stateParams', 'menuFactory', 'commentFactory', function ($scope, $state, $stateParams, menuFactory, commentFactory) {

    $scope.dish = {};
    $scope.showDish = false;
    $scope.message = "Loading ...";

    $scope.dish = menuFactory.get({
        id: $stateParams.id
    })
        .$promise.then(
            function (response) {
                $scope.dish = response;
                $scope.showDish = true;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );

    $scope.mycomment = {
        rating: 5,
        comment: ""
    };

    $scope.submitComment = function () {

        commentFactory.save({ id: $stateParams.id }, $scope.mycomment);

        $state.go($state.current, {}, { reload: true });

        $scope.commentForm.$setPristine();

        $scope.mycomment = {
            rating: 5,
            comment: ""
        };
    }
}])

// implement the IndexController and About Controller here

.controller('HomeController', ['$scope', 'menuFactory', function ($scope, menuFactory, promotionFactory) {
    $scope.showDish = false;
    $scope.showLeader = false;
    $scope.showPromotion = false;
    $scope.message = "Loading ...";
}])

.controller('AboutController', ['$scope', function ($scope) {

    $scope.leaders = {};

}])

.controller('FavoriteController', ['$scope', '$state', 'favoriteFactory', function ($scope, $state, favoriteFactory) {

    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;
    $scope.showDelete = false;
    $scope.showMenu = false;
    $scope.message = "Loading ...";

    favoriteFactory.query(
        function (response) {
            $scope.dishes = response.dishes;
            $scope.showMenu = true;
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        });

    $scope.select = function (setTab) {
        $scope.tab = setTab;

        if (setTab === 2) {
            $scope.filtText = "appetizer";
        } else if (setTab === 3) {
            $scope.filtText = "mains";
        } else if (setTab === 4) {
            $scope.filtText = "dessert";
        } else {
            $scope.filtText = "";
        }
    };

    $scope.isSelected = function (checkTab) {
        return ($scope.tab === checkTab);
    };

    $scope.toggleDetails = function () {
        $scope.showDetails = !$scope.showDetails;
    };

    $scope.toggleDelete = function () {
        $scope.showDelete = !$scope.showDelete;
    };

    $scope.deleteFavorite = function (dishid) {
        console.log('Delete favorites', dishid);
        favoriteFactory.delete({ id: dishid });
        $scope.showDelete = !$scope.showDelete;
        $state.go($state.current, {}, { reload: true });
    };
}])

.controller('HeaderController', ['$scope', '$state', '$rootScope', 'ngDialog', 'AuthFactory', function ($scope, $state, $rootScope, ngDialog, AuthFactory) {

    $scope.loggedIn = false;
    $scope.username = '';
    $scope.isAdmin = false;

    if (AuthFactory.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthFactory.getUsername();
        $scope.isAdmin = AuthFactory.isAdmin();
    }

    $scope.openLogin = function () {
        ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-default', controller: "LoginController" });
    };

    $scope.logOut = function () {
        AuthFactory.logout();
        $scope.loggedIn = false;
        $scope.username = '';
        $scope.isAdmin = false;
    };

    $rootScope.$on('login:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
        $scope.isAdmin = AuthFactory.isAdmin();
    });

    $rootScope.$on('registration:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
        $scope.isAdmin = AuthFactory.isAdmin();
    });

    $scope.stateis = function (curstate) {
        return $state.is(curstate);
    };

    $scope.openRegister = function () {
        ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default', controller: "RegisterController" });
    };
}])

.controller('LoginController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {

    $scope.loginData = $localStorage.getObject('userinfo', '{}');

    $scope.doLogin = function () {
        if ($scope.rememberMe)
            $localStorage.storeObject('userinfo', $scope.loginData);

        AuthFactory.login($scope.loginData);

        ngDialog.close();

    };

    $scope.openRegister = function () {
        ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default', controller: "RegisterController" });
    };

}])

.controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {

    $scope.register = {};
    $scope.loginData = {};
    $scope.isCurrentUserAdmin = AuthFactory.isAdmin();
    $scope.companies = {};
    $scope.admin = false;
    $scope.doRegister = function () {
        console.log('Doing registration', $scope.registration);
        if (typeof ($scope.registration) === "undefined") {
            $scope.registration = false;
        }
        AuthFactory.register($scope.registration);

        ngDialog.close();

    };
}])
.controller('OrganizationController', ['$scope', 'ngDialog', '$localStorage', 'OrgFactory', function ($scope, ngDialog, $localStorage, OrgFactory) {
    $scope.orgs = {};
    $scope.addNewFormIsVisible = false;
    $scope.processMessage = '';
    $scope.showProcessMessage = false;
    $scope.newOrg = { organizationName: '', contactName: '', contactEmail: '', contactPhone: '' };
    $scope.orgSelected = {};

    OrgFactory.orgs.query(
	function (response) {
	    $scope.showProcessMessage = false;
	    $scope.orgs = response;
	    resetLinesProps($scope.orgs);
	},
	function (response) {
	    console.log('Error found in controller while retrieving the organizations ');
	    $scope.processMessage = response.data;
	    $scope.showProcessMessage = true;
	}
	);

    $scope.showAddNewForm = function (isVisible) {
        $scope.showProcessMessage = false;
        $scope.addNewFormIsVisible = isVisible;
    }

    $scope.addNewOrg = function () {
        $scope.processMessage = '';
        $scope.showProcessMessage = false;

        OrgFactory.orgs.save($scope.newOrg,
			function (response) {
			    console.log('new organization Created id:' + 'response._id');
			    OrgFactory.orgs.query(
				function (response) {
				    $scope.orgs = response;
				    resetLinesProps($scope.orgs);
				},
				function (response) {
				    console.log('Error found in controller while retrieving the organizations ');
				}
				);
			},
			function (response) {
			    console.log('failed to create new organization');
			}
		);
        $scope.addNewFormIsVisible = false;
        $scope.newOrg = { organizationName: '', contactName: '', contactEmail: '', contactPhone: '' }
    };

    $scope.cancelAddNew = function () {
        $scope.processMessage = '';
        $scope.showProcessMessage = false;
        $scope.addNewFormIsVisible = false;
        $scope.newOrg = { organizationName: '', contactName: '', contactEmail: '', contactPhone: '' }
    };

    $scope.deleteOrg = function (orgId) {
        $scope.processMessage = 'Deleting organization';
        $scope.showProcessMessage = true;
        OrgFactory.orgs.delete({ 'orgId': orgId },
			function (response) {
			    console.log('Organization Deleted id:' + 'response._id');
			    OrgFactory.orgs.query(
				function (response) {
				    $scope.orgs = response;
				    resetLinesProps($scope.orgs);
				    $scope.processMessage = '';
				    $scope.showProcessMessage = false;
				},
				function (response) {
				    console.log('Error found in controller while deleting the organization ');
				    $scope.processMessage = 'Error found in controller while deleting the organization ';
				    $scope.showProcessMessage = true;
				});
			},
			function (response) {
			    console.log('failed to delete organization');
			    $scope.processMessage = 'failed to delete organization  ';
			    $scope.showProcessMessage = true;
			})
    };

    $scope.editOrg = function (org) {
        $scope.showProcessMessage = false;
        var lineId = 0;
        if (org) lineId = org.lineId | 0;
        if ($scope.orgs && Array.isArray($scope.orgs) && $scope.orgs.length > 0) {
            if (lineId >= 0 && lineId < $scope.orgs.length) {
                for (var j = 0; j < $scope.orgs.length; j++) {
                    $scope.orgs[j].edit = j === lineId;
                }
            }
        }
    };

    $scope.saveEditedOrg = function (orgId, lineId) {
        $scope.processMessage = 'Saving change to orgicle: ';
        $scope.showProcessMessage = true;
        var org = $scope.orgs[lineId];
        OrgFactory.orgs.update({ orgId: orgId, organizationName: org.organizationName, contactName: org.contactName, contactEmail: org.contactEmail, contatPhone: org.contactPhone },
			function (response) {
			    console.log('Organation Saved -  id:' + 'response._id');
			    $scope.showProcessMessage = false;
			    $scope.processMessage = '';
			},
			function (response) {
			    console.log('failed to save Changes to  organization  ');
			    $scope.processMessage = 'failed to save change to organization ';
			    $scope.showProcessMessage = true;
			})

        $scope.orgs[lineId].edit = false;
    };

    $scope.cancelEditOrg = function (lineId) {
        $scope.orgs[lineId].edit = false;
    };

    function resetLinesProps(items) {
        if (items && Array.isArray(items) && items.length > 0) {
            for (var j = 0; j < items.length; j++) {
                items[j].edit = false;
                items[j].lineId = j;
                items[j].entitiesCount = 0;
                if (Array.isArray(items[j].entities)) {
                    items[j].entitiesCount = items[j].entities.length;
                }
            }
        }
    }

}])
.controller('OrganizationDetailController', ['$scope', '$stateParams', 'ngDialog', '$localStorage', 'OrgFactory', 'EntityFactory', function ($scope, $stateParams, ngDialog, $localStorage, OrgFactory, EntityFactory) {
    $scope.org = {};
    $scope.addNewFormIsVisible = false;
    $scope.editCurrent = false;
    $scope.processMessage = '';
    $scope.showProcessMessage = false;
    $scope.newOrg = {};
    $scope.selectedOrgId = $stateParams.orgId;
    $scope.entitiesCount = 0;
    $scope.showEntities = false;
    $scope.addNewEntityFormIsVisible = false;
    $scope.availableEntities = [];
    $scope.availableEntitiesNeedsRefresh = true;
    $scope.showAvailableEntities = false;
    $scope.selectedEntity = '';

    resetNewOrg();

    //Getting the organuization from the server
    OrgFactory.orgs.getOne({ orgId: $scope.selectedOrgId },
	function (response) {
	    $scope.showProcessMessage = false;
	    $scope.org = response;
	    configureEntities();
	},
	function (response) {
	    console.log('Error found in controller while retrieving the organizations ');
	    $scope.processMessage = response.data;
	    $scope.showProcessMessage = true;
	});

    $scope.showAddNewForm = function (isVisible, editMode) {
        $scope.showProcessMessage = false;
        $scope.addNewFormIsVisible = isVisible;
        $scope.editCurrent = editMode | false;
        if ($scope.editCurrent) {
            $scope.newOrg = $scope.org;
        } else {
            resetNewOrg();
        }
    };

    $scope.showAvailableEntity = function (isVisible) {
        $scope.showProcessMessage = false;
        $scope.showAvailableEntities = isVisible;
        if ($scope.availableEntitiesNeedsRefresh) {
            retrieveAvailableEntities();
        }
    };

    function retrieveAvailableEntities() {
        EntityFactory.entitiesNotInOrg.query({ orgId: $scope.selectedOrgId }, function (response) {
            $scope.availableEntities = response;
            $scope.availableEntitiesNeedsRefresh = false;
        }, function (response) {
            $scopeAvailableEntites = [];
            $scope.showProcessMessage = true;
            $scope.processMessage = "Failed to retrieve entities for this organization";
        });
    }


    $scope.addNewOrg = function () {
        $scope.processMessage = '';
        $scope.showProcessMessage = false;

        if ($scope.editCurrent) {
            $scope.editCurrent = false;
            $scope.saveCurrentOrg();
        } else {
            OrgFactory.orgs.save($scope.newOrg,
                function (response) {
                    console.log('new organization Created id:' + 'response._id');
                    $scope.org = response;
                    configureEntities();
                },
                function (response) {
                    console.log('failed to create new organization');
                }
            );
        }
        $scope.addNewFormIsVisible = false;
    };

    $scope.cancelAddNew = function () {
        $scope.processMessage = '';
        $scope.showProcessMessage = false;
        $scope.addNewFormIsVisible = false;
        $scope.editCurrent = false;
        resetNewOrg();
    };

    $scope.editOrg = function (org) {
        $scope.showProcessMessage = false;
        $scope.editCurrent = true;
        $scope.newOrg = $scope.org;
    };

    $scope.saveCurrentOrg = function () {
        $scope.processMessage = 'Saving change to organization: ';
        $scope.showProcessMessage = true;
        var org = $scope.org;
        OrgFactory.orgs.update({ orgId: org._id, organizationName: org.organizationName, contactName: org.contactName, contactEmail: org.contactEmail, contactPhone: org.contactPhone },
			function (response) {
			    console.log('Organization Saved -  id:' + 'response._id');
			    $scope.showProcessMessage = false;
			    $scope.processMessage = '';
			    $scope.editCurrent = false;
			    $scope.addNewFormIsVisible = false;
			    resetNewOrg();
			},
			function (response) {
			    console.log('Organization Details form failed to save Changes to  organization  ');
			    $scope.processMessage = 'failed to save change to organization ';
			    $scope.showProcessMessage = true;
			});
    };

    $scope.removeEntity = function (entId) {
        $scope.processMessage = 'Adding Entity to organization: ';
        $scope.showProcessMessage = true;
        OrgFactory.ents.delete({ orgId: $scope.selectedOrgId, entId: entId },
            function (response) {
                // Update the org object
                OrgFactory.orgs.getOne({ orgId: $scope.selectedOrgId },
                function (response) {
                    $scope.showProcessMessage = false;
                    $scope.org = response;
                    configureEntities();
                    retrieveAvailableEntities();
                },
                function (response) {
                    console.log('Error found in controller while retrieving the organizations after adding entity ');
                    $scope.processMessage = response.data;
                    $scope.showProcessMessage = true;
                });
            },
            function (response) {
                console.log('Organization Details form failed to add entity to   organization  ');
                $scope.processMessage = 'Failed to add entity to organization ';
                $scope.showProcessMessage = true;
            });
    };

    $scope.addEntity = function (entId) {
        $scope.processMessage = 'Adding Entity to organization: ';
        $scope.showProcessMessage = true;
        OrgFactory.ents.update({ orgId: $scope.selectedOrgId, entId: entId },
            function (response) {
                // Update the org object
                OrgFactory.orgs.getOne({ orgId: $scope.selectedOrgId },
                function (response) {
                    $scope.showProcessMessage = false;
                    $scope.org = response;
                    configureEntities();
                },
                function (response) {
                    console.log('Error found in controller while retrieving the organizations after adding entity ');
                    $scope.processMessage = response.data;
                    $scope.showProcessMessage = true;
                });
                retrieveAvailableEntities();
            },
            function (response) {
                console.log('Organization Details form failed to add entity to   organization  ');
                $scope.processMessage = 'Failed to add entity to organization ';
                $scope.showProcessMessage = true;
            });
    };

    $scope.availableEntities = function () {
        EntityFactory.entitiesNotInOrg.query({ orgId: $scope.selectedOrgId },
            function (response) {
                $scope.availableEntities = response;
            },
            function (response) {
                $scope.availableEntities = [];
                console.log('Organization Details form failed to add entity to   organization  ');
                $scope.processMessage = 'Failed to add entity to organization ';
                $scope.showProcessMessage = true;
            }
            );
    };



    $scope.cancelAddingEntities = function () {
        $scope.showAvailableEntities = false;
    }

    function resetNewOrg() {
        $scope.newOrg = { organizationName: '', contactName: '', contactEmail: '', contactPhone: '' }
    }

    function configureEntities() {
        var entitiesCount = 0;
        if ($scope.org && $scope.org.entities && Array.isArray($scope.org.entities)) {
            entitiesCount = $scope.org.entities.length;
        }
        $scope.showEntities = entitiesCount > 0;
        $scope.entitiesCount = entitiesCount;
    }
}])
.controller('EntityController', ['$scope', 'ngDialog', '$localStorage', 'EntityFactory', function ($scope, ngDialog, $localStorage, EntityFactory) {
    $scope.ents = {};
    $scope.addNewFormIsVisible = false;
    $scope.processMessage = '';
    $scope.showProcessMessage = false;
    $scope.newEnt = { name: '', url: '', description: '' };

    EntityFactory.entities.query(
	function (response) {
	    $scope.showProcessMessage = false;
	    $scope.ents = response;
	},
	function (response) {
	    console.log('Error found in controller while retrieving the entities ');
	    $scope.processMessage = response.data;
	    $scope.showProcessMessage = true;
	}
	);

    $scope.showAddNewForm = function (isVisible) {
        $scope.showProcessMessage = false;
        $scope.addNewFormIsVisible = isVisible;
    }

    $scope.addNewEntity = function () {
        $scope.processMessage = '';
        $scope.showProcessMessage = false;
        EntityFactory.entities.save($scope.newEnt,
			function (response) {
			    console.log('new Entity Created id:' + 'response._id');
			    EntityFactory.entities.query(
				function (response) {
				    $scope.ents = response;
				},
				function (response) {
				    console.log('Error found in controller while retrieving the entities ');
				}
				);
			},
			function (response) {
			    console.log('failed to create new entity');
			}
		);
        $scope.addNewFormIsVisible = false;
        $scope.newEnt = { name: '', url: '', description: '' };

    }

    $scope.deleteEntity = function (entId) {
        $scope.processMessage = 'Deleting entity';
        $scope.showProcessMessage = true;
        EntityFactory.entities.delete({ 'entId': entId },
			function (response) {
			    console.log('Entity Deleted id:' + 'response._id');
			    EntityFactory.entities.query(
				function (response) {
				    $scope.ents = response;
				},
				function (response) {
				    console.log('Error found in controller while deleting the entities ');
				    $scope.processMessage = 'Error found in controller while deleting the entities ';
				    $scope.showProcessMessage = true;
				}
				);
			},
			function (response) {
			    console.log('failed to delete entity');
			    $scope.processMessage = 'failed to delete entity  ';
			    $scope.showProcessMessage = true;
			})
    };

    $scope.cancelAddNew = function () {
        $scope.processMessage = '';
        $scope.showProcessMessage = false;
        $scope.addNewFormIsVisible = false;
        $scope.newEnt = { name: '', url: '', description: '' };
    }
}])
.controller('EntityDetailController', ['$scope', '$stateParams', '$localStorage', 'EntityFactory', function ($scope, $stateParams, $localStorage, EntityFactory) {
    $scope.ents = {};
    $scope.addNewFormIsVisible = false;
    $scope.processMessage = '';
    $scope.showProcessMessage = false;
    $scope.newEnt = { name: '', url: '', description: '' };
    $scope.orgId = '';
    $scope.entId = '';
    $scope.showOrgBreadcrumbs = false;

    $scope.entId = $stateParams.entId;
    $scope.orgId = $stateParams.orgId;

    if ($scope.entId && $scope.orgId) {
        $scope.showOrgBreadcrumbs = true;
    }
    EntityFactory.entities.query(
	function (response) {
	    $scope.showProcessMessage = false;
	    $scope.ents = response;
	},
	function (response) {
	    console.log('Error found in controller while retrieving the entities ');
	    $scope.processMessage = response.data;
	    $scope.showProcessMessage = true;
	}
	);

    $scope.showAddNewForm = function (isVisible) {
        $scope.showProcessMessage = false;
        $scope.addNewFormIsVisible = isVisible;
    }

    $scope.addNewEntity = function () {
        $scope.processMessage = '';
        $scope.showProcessMessage = false;
        EntityFactory.entities.save($scope.newEnt,
			function (response) {
			    console.log('new Entity Created id:' + 'response._id');
			    EntityFactory.entities.query(
				function (response) {
				    $scope.ents = response;
				},
				function (response) {
				    console.log('Error found in controller while retrieving the entities ');
				}
				);
			},
			function (response) {
			    console.log('failed to create new entity');
			}
		);
        $scope.addNewFormIsVisible = false;
        $scope.newEnt = { name: '', url: '', description: '' };

    }

    $scope.deleteEntity = function (entId) {
        $scope.processMessage = 'Deleting entity';
        $scope.showProcessMessage = true;
        EntityFactory.entities.delete({ 'entId': entId },
			function (response) {
			    console.log('Entity Deleted id:' + 'response._id');
			    EntityFactory.entities.query(
				function (response) {
				    $scope.ents = response;
				},
				function (response) {
				    console.log('Error found in controller while deleting the entities ');
				    $scope.processMessage = 'Error found in controller while deleting the entities ';
				    $scope.showProcessMessage = true;
				}
				);
			},
			function (response) {
			    console.log('failed to delete entity');
			    $scope.processMessage = 'failed to delete entity  ';
			    $scope.showProcessMessage = true;
			})
    };

    $scope.cancelAddNew = function () {
        $scope.processMessage = '';
        $scope.showProcessMessage = false;
        $scope.addNewFormIsVisible = false;
        $scope.newEnt = { name: '', url: '', description: '' };
    }
}])
.controller('ArticleController', ['$scope', 'ngDialog', '$localStorage', 'ArticleFactory', function ($scope, ngDialog, $localStorage, ArticleFactory) {
    $scope.arts = {};
    $scope.addNewFormIsVisible = false;
    $scope.processMessage = '';
    $scope.showProcessMessage = false;
    $scope.newArt = { name: '', link: '', description: '', longDescription: '', isActive: true };
    ArticleFactory.articles.query(
	function (response) {
	    $scope.showProcessMessage = false;
	    $scope.arts = response;
	    if ($scope.arts && Array.isArray($scope.arts) && $scope.arts.length > 0) {
	        for (var j = 0; j < $scope.arts.length; j++) {
	            $scope.arts[j].edit = false;
	            $scope.arts[j].lineId = j;
	        }
	    }
	},
	function (response) {
	    console.log('Error found in controller while retrieving the articles ');
	    $scope.processMessage = response.data;
	    $scope.showProcessMessage = true;
	}
	);

    $scope.showAddNewForm = function (isVisible) {
        $scope.showProcessMessage = false;
        $scope.addNewFormIsVisible = isVisible;
    }

    $scope.addNewArticle = function () {
        $scope.processMessage = '';
        $scope.showProcessMessage = false;
        ArticleFactory.articles.save($scope.newArt,
			function (response) {
			    console.log('new Article Created id:' + 'response._id');
			    ArticleFactory.articles.query(
				function (response) {
				    $scope.arts = response;
				},
				function (response) {
				    console.log('Error found in controller while retrieving the articles` ');
				}
				);
			},
			function (response) {
			    console.log('failed to create new article');
			}
		);
        $scope.addNewFormIsVisible = false;
        $scope.newArt = { name: '', link: '', description: '', longDescription: '', isActive: true };

    }

    $scope.deleteArticle = function (artId) {
        $scope.processMessage = 'Deleting article';
        $scope.showProcessMessage = true;
        ArticleFactory.articles.delete({ 'artId': artId },
			function (response) {
			    console.log('Article Deleted id:' + 'response._id');
			    ArticleFactory.articles.query(
				function (response) {
				    $scope.arts = response;
				},
				function (response) {
				    console.log('Error found in controller while deleting the articles ');
				    $scope.processMessage = 'Error found in controller while deleting the articles ';
				    $scope.showProcessMessage = true;
				}
				);
			},
			function (response) {
			    console.log('failed to delete article');
			    $scope.processMessage = 'failed to delete article  ';
			    $scope.showProcessMessage = true;
			})
    };

    $scope.editArticle = function (artId, lineId) {
        $scope.showProcessMessage = false;
        if ($scope.arts && Array.isArray($scope.arts) && $scope.arts.length > 0) {
            if (lineId >= 0 && lineId < $scope.arts.length) {
                for (var j = 0; j < $scope.arts.length; j++) {
                    $scope.arts[j].edit = j === lineId;
                }
            }
        }
    };

    $scope.saveEditedArticle = function (artId, lineId) {
        $scope.processMessage = 'Saving change to article: ';
        $scope.showProcessMessage = true;
        var art = $scope.arts[lineId];
        ArticleFactory.articles.update({ artId: artId, name: art.name, link: art.link, description: art.description, longDescription: art.longDescription, isActive: art.isActive },
			function (response) {
			    console.log('Article Saved -  id:' + 'response._id');
			    $scope.showProcessMessage = false;
			    $scope.processMessage = '';
			},
			function (response) {
			    console.log('failed to save Changes to  article ');
			    $scope.processMessage = 'failed to save change to article  ';
			    $scope.showProcessMessage = true;
			})

        $scope.arts[lineId].edit = false;
    };

    $scope.cancelEditArticle = function (lineId) {
        $scope.arts[lineId].edit = false;
    };

    $scope.cancelAddNew = function () {
        $scope.processMessage = '';
        $scope.showProcessMessage = false;
        $scope.addNewFormIsVisible = false;
        $scope.newEnt = { name: '', url: '', description: '' };
    }
}])

;