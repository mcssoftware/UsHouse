(function ($) {
    $(function () {
        //Check if page has tab navigation loading views
        if (!$("[data-load-views]").length > 0) {
            App.has_view_to_load = false;
            App.adaptive_template();
            App.accessibility();
            return;
        }

        //Initialize tabCollapse based on browser size
        if (window.innerWidth >= 768) {
            App.has_view_to_load = true;
            $('[data-load-views="true"]').tabCollapse();
            App.adaptive_template();
            App.accessibility();
        }
        else {
            App.has_view_to_load = true;
            $('[data-load-views="true"]').tabCollapse().on('shown-accordion.bs.tabcollapse', function () { });
            setTimeout(function () {
                App.adaptive_template();
                App.accessibility();
            }, 500);
        }

        var loadHouseStats = function () {
            if ($("#view-at-a-glance").length) {
                $("#view-at-a-glance").load("/Home/ViewHouseStatistics", function () {
                    if ($("#member-stats").length) {
                        //$("#menu-member-stats").html($("#member-stats").html());
                    }
                });
            }
        };

        loadHouseStats();

        setInterval(function () {
            loadHouseStats();
        }, 1200000);

        setInterval(function () {
            if ($("#view-session-status").length) {
                var prevStatus = $("#hidden-session-status").val();
                $("#view-session-status").load("/Home/ViewStatus", function () {
                    var currentStatus = $("#hidden-session-status").val();
                    if (prevStatus != currentStatus) {
                        $("#view-tabs").load("/Home/ViewTabs", function () {
                            App.events_handler();
                            App.ux_enhancement();
                            App.load_views();
                            datePicker();
                        });
                    }
                });
            }
        }, 60000);

        setInterval(function () {
            if ($("#view-session-status").length) {
                if ($("#hidden-session-status").val() == "InSessionNow") {
                    if ($(App.currentTab + " #floor-actions").length) {
                        if ($("#floor-activity-table").length) {
                            var orderCol, orderDir;
                            try {
                                var order = $("#floor-activity-table").DataTable().order();
                                orderCol = order[0][0];
                                orderDir = order[0][1];
                            }
                            catch (err) {
                                //console.log(err.message);
                            }
                            $("#floor-actions").load("/Home/ViewFloorActions", function () {
                                $("#floor-activity-table").on("init.dt", function () {
                                    App.set_last_floor_action();
                                    App.action_refresh_events();
                                    try {
                                        $("#floor-activity-table").DataTable().order([[orderCol, orderDir]]).draw();
                                    }
                                    catch (err) {
                                        //console.log(err.message);
                                    }
                                }).dataTable();

                                App.dataTables_init_settings(App.currentTab);
                                App.paging_handlers();
                                App.fix_externalLinks();
                                App.set_pagination_less_more(App.currentTab);

                                $("#floor-activity-table").on("error.dt", function (e, settings, techNote, message) {
                                    //console.log("An error has been reported by DataTables: ", message);
                                }).dataTable();

                                $("#floor-activity-table").on("order.dt", function () {
                                    var order = $("#floor-activity-table").DataTable().order();
                                    //console.log("Ordering on column " + order[0][0] + " (" + order[0][1] + ")");
                                });
                            });
                        }
                    }
                }
            }
        }, 5000);
    });

    //Trigger event when window resize stop
    $(window).on("resize", function () {
        clearTimeout(App.resizeTimer);
        App.resizeTimer = setTimeout(function () {
            //Get window width, desktop or mobile size (768)
            var mobileDesktopSwich = ((window.innerWidth >= 768 && App.windowSize < 768) || (window.innerWidth < 768 && App.windowSize >= 768));
            //only run functions if "width" changes and the size changes between mobile to desktop 
            if (window.innerWidth !== App.windowSize && mobileDesktopSwich) {
                App.OnLoadEvent = false;
                App.adaptive_template();
                App.video_fix();
                //fix resize display content
                if (window.innerWidth >= 768 && App.windowSize < 768) {
                    var elemToExpand = $('.nav-tabs .active a, .nav-pills .active a').attr('href');
                    $(elemToExpand).addClass('active');
                }
                //update window size
                App.windowSize = window.innerWidth;
            }
            else {
                //App.OnLoadEvent = true;
                //update window size
                App.windowSize = window.innerWidth;
            }
        }, 200);
    });

    var App = {
        has_view_to_load: false,
        OnLoadEvent: true,
        resizeTimer: "",
        windowSize: window.innerWidth,
        limitIndex: null,
        azurePlayers: [],
        jwplayers: [],
        openTextList: [],
        pageTitle: "Office of the Clerk, U.S. House of Representatives",

        adaptive_template: function () {
            //check if the page has view to load into tabs
            //otherwise display simple page
            if (App.has_view_to_load) {
                App.get_url_hash();
            }
            else {
                App.no_loading_views();
            }

            //add event handler and ux enhancement
            App.events_handler();
            App.ux_enhancement();

            //Accessibility and check the window size to display the right menu (tabs/accordion)
            if (window.innerWidth >= 768) {
                $('.tab-content').attr('aria-hidden', 'false').show();
                $('.panel-group').attr('aria-hidden', 'true').hide();
                //remove data-load-views to panel-group
                $('.panel-group').removeAttr('data-load-views');
            }
            else { //Mobile
                //add data-load-views to panel-group
                $('.panel-group').attr('data-load-views', 'true');
                //Resize menu box to make it scrollable if window hight is smaller than menu
                $('.bs-js-navbar-collapse').on('shown.bs.collapse', function (e) {
                    var menu = $(e.currentTarget),
                        windH = $(window).height();
                    if ((windH - 60) < 360) {
                        menu.height(windH - 60);
                    }
                });

                $('.tab-content').attr('aria-hidden', 'true').hide();
                $('.panel-group').attr('aria-hidden', 'false').show();
                //toggle active on mobile size
                $('.dropdown a.dropdown-toggle').on('click', function () {
                    $('.dropdown a.dropdown-toggle').removeClass('active');
                    $(this).addClass('active');
                });
            }
        },
        accessibility: function () {
            //arrows navigation
            $(document).on('keyup', function (e) {
                //Using Left/Right Arrows Navigation
                var $focused = $(':focus'),
                    $itemParent = $focused.closest('ul[role]'),
                    $itemParentType = $($itemParent).attr('role'),
                    $itemsLength = $itemParent.find('.dropdown');

                //Top Menu blue Navigation
                if ($itemParent.length > 0 && $itemParentType === 'menubar') {
                    if (e.which == 39) {
                        $focused.parent('.dropdown').next('.dropdown').find('.dropdown-toggle').focus().trigger('click');
                    }
                    else if (e.which == 37) {
                        $focused.parent('.dropdown').prev('.dropdown').find('.dropdown-toggle').focus().trigger('click');
                    }
                }
                else if ($itemParent.length > 0 && $itemParentType === 'tablist') {
                    if (e.which == 39 || e.which == 40) {
                        $focused.closest('[role=presentation]').next('[role=presentation]').find('a').focus();
                    }
                    else if (e.which == 37 || e.which == 38) {
                        $focused.closest('[role=presentation]').prev('[role=presentation]').find('a').focus();
                    }
                }
                else if ($itemParentType === 'menu' && $($itemParent).closest('.sub-navigation').length > 0) {
                    if (e.which == 39) {
                        $focused.closest('[role=menuitem]').next('[role=menuitem]').find('a').focus();
                    }
                    else if (e.which == 37) {
                        $focused.closest('[role=menuitem]').prev('[role=menuitem]').find('a').focus();
                    }
                }
            });

            $("a[data-custom-nav='sidenav']").focus(function () {
                var ae = document.activeElement;
                $(this).on("keydown", function (e) {
                    var key = e.keyCode || e.which;
                    if (key == 13) {
                        $(ae).trigger("click");
                    }
                });
            });

            $("a[data-custom-tab='tab']").focus(function () {
                var ae = document.activeElement;
                $(this).on("keydown", function (e) {
                    var key = e.keyCode || e.which;
                    if (key == 13) {
                        $(ae).trigger("click");
                    }
                });
            });

            $("a[data-custom-show='detail']").focus(function () {
                var ae = document.activeElement;
                $(this).on("keydown", function (e) {
                    console.log(ae);
                    var key = e.keyCode || e.which;
                    if (key == 13) {
                        $(ae).trigger("click");
                    }
                });
            });

            $("a[data-toggle='tab']").focus(function () {
                var ae = document.activeElement;
                $(this).on("keydown", function (e) {
                    var key = e.keyCode || e.which;
                    if (key == 13) {
                        $(ae).trigger("click");
                    }
                });
            });

            //Close dropdowm menu if leaving the blue navigation
            //$(document).on('keydown', function (e) {
            //    var $focused = $(':focus'),
            //        $parentChecker = $focused.closest('.has-datapicker').length > 0 || $focused.next('.has-datapicker').length > 0,
            //        $itemParent = $focused.closest('#blue-nav').attr('role');

            //    //Check if is tab key and the dropdown menu doesnt contain the datepicker
            //    if (e.which == 9 && !($parentChecker)) {
            //        if ($itemParent === 'menubar') {
            //            $('#blue-nav .dropdown.open .dropdown-toggle').dropdown('toggle');
            //        }
            //    }
            //});
        },
        ux_enhancement: function () {
            var _this;
            //scroll to content position after accordion animation is finished
            $('.panel-group .collapse').on('shown.bs.collapse', function (e) {
                //Fixing multiple accordion group using tabCollapse plugin
                //It will close the open accordions
                _this = $(e.currentTarget).attr('id');
                $('[data-load-views="true"] .collapse:not(#' + _this + ') ').removeClass('in');

                //Scroll to Content
                $('html, body').animate({
                    scrollTop: $('.collapse.in').offset().top - 100
                }, 500);
            });
        },
        events_handler: function () {
            //Toggling the download button on floor view
            $(document).on('click', '.option-dropdown', function (e) {
                e.stopPropagation();
                $(this).find('.option-menu').toggle();
            });

            //avoid closing datepicker
            $('#ui-datepicker-div').click(function (event) {
                event.stopPropagation();
            });

            //Toggles the body overflow when menu is open (so there is not two scrollbars / possible problems that arise with two concurrent vertical scrollbars)
            $(document).on('click', '.navbar-toggle', function (e) {
                $('.navbar-collapse').attr('aria-expanded') === "true" ?
                    $('body').css('overflow-y', 'hidden') :
                    $('body').css('overflow-y', 'scroll');
            });

            // Animations for clicking on the dropdown nav on mobile
            $('.dropdown').click(function () {
                //var width = $(window).width();
                if (window.innerWidth < 768) {
                    $('.dropdown').children('div').slideUp();
                    $('.dropdown').children('a').removeClass('down');
                    if ($(this).children('div').css('display') === 'none') {
                        $(this).children('a').addClass('down');
                        $(this).children('div').slideDown();
                        $('.navbar-collapse').animate({
                            scrollTop: 0
                        }, 'slow');
                    };
                }
            });

            // Hiding/showing expanded/trimmed table content
            $(document).on("click", ".trimmed-content__cutoff-text", function () {
                var actionId = $(this).closest('tr').attr('data-actionId');
                var openTextIndex = App.openTextList.indexOf(actionId);

                // When the actions are refreshed, the HTML gets reset
                // Becuase of this, we want to keep a list of what activies are open (on mobile) and add the appropriate classes on refesh
                (openTextIndex === -1) ? App.openTextList.push(actionId) : App.openTextList.splice(openTextIndex, 1);

                // If the content is trimmed, hides the trimmed text, shows the full text, switches 'Show More' to 'Show Less'
                // If the content is not trimmed, shows the trimmed text, hides the full text, switches 'Show Less' to 'Show More'
                $(this).prev().toggle();
                $(this).prev().prev().toggle();
                $(this).toggleClass("trimmed-content__cutoff-text--trimmed trimmed-content__cutoff-text--expanded");
                return false;
            });

            // Custom implementation of View-Detail hiding and showing because Magnum's version only works with Bills and has no clear way of adding other tables
            $(document).on("click", ".custom-view-details", function () {
                var td = $(this).closest("td");
                var details = td.next();
                if (details.hasClass("hidden")) {
                    $(this).text("Hide Details");
                    details.removeClass("hidden");
                } else {
                    $(this).text("View Details");
                    details.addClass("hidden");
                }
            });

            // Showing & hiding of the survey
            //$(document).on("click", ".survey__tab", function () {
            //    var survey = $(this).closest(".survey");
            //    survey.toggleClass("survey--hidden survey--shown");
            //});

            //$(document).on("click", ".survey__close", function () {
            //    var survey = $(this).closest(".survey");
            //    if (survey.hasClass("survey--shown")) survey.toggleClass("survey--hidden survey--shown");
            //});

            // Custom routing for menu links that would otherwise go to partial views
            // The partial views themselves are not what we want to render, so we need to link to the hash and hard refresh the page
            // The hard refresh is needed because normally when you are on the same view ("/About#History" and "/About#Duties"), only the hash changes and page would not update
            $(document).on("click", ".partial-view-link", function (e) {
                e.preventDefault(); // Ignore standard behavior
                var route = $(this).attr("href");
                var currentRoute = window.location.pathname + window.location.hash;
                var onCurrentPath = !!(route.indexOf(window.location.pathname) !== -1) && (window.location.pathname !== "/"); // Check if we are navigating to a different subpage on the same path

                // Only navigate if the page is different
                if (route !== currentRoute) {
                    window.location.href = route; // "Manual" route change
                    if (onCurrentPath) window.location.reload(); // If we are already on the /pathname, the page will not automatically reload if just changing the hash
                }
            });

            //set class style for all the left navigation on double columns pages
            $(".left-nav-group ul").removeClass('active-group');
            $(".left-nav-group li.active").parent('ul').addClass('active-group');
            $('.left-nav-group li a').click(function () {
                $(".left-nav-group ul").removeClass("active-group");
                $(this).parents("ul").addClass("active-group");
                $(".left-nav-group").not('.active-group').find('li').removeClass('active');
            });

            //Top Search functionality
            var box = $(".header-search-grp .search");
            $(document).click(function () {
                box.removeClass("expanded");
                $('.option-menu').hide(); // Hide download button option if clicked outside 
            });
            box.click(function (e) {
                e.stopPropagation();
                box.addClass("expanded");
            });

            //Members list filter (toggle active class)
            $('.members-list_bts button[type="button"]').on('click', function (e) {
                $('.members-list_bts .btn').removeClass('active');
                $(this).addClass('active');
            });

            $("[data-load-views] a:not('.external'), a.js-tabcollapse-panel-heading:not('.external') ").off("click");
            $("[data-load-views] a:not('.external'), a.js-tabcollapse-panel-heading:not('.external') ").on('click', function (e) {
                e.preventDefault();

                var viewName = $(this).data('view'),
                    tabRepo = $(this).attr('href'),
                    checkEmptyRepo = true;

                //check if mobile or desktop
                //and test if repo container is empty
                if (window.innerWidth < 768) {
                    //checkEmptyRepo = $(tabRepo + " .panel-body").length; //mobile
                    if ($(this).attr('aria-expanded') === "true") {
                        checkEmptyRepo = false;
                    }
                }
                else {
                    //checkEmptyRepo = !$.trim($(tabRepo).html()).length; //desktop
                }

                App.currentTab = tabRepo;

                //If tab is empty load content
                if (checkEmptyRepo) {
                    App.populateTab(viewName, tabRepo)
                }
                else {
                    var isNotHomeRoute = (window.location.pathname !== "/"); // We do not want history states for the tabs on the home page right now
                    var isDifferentState = window.location.hash.slice(1) !== viewName.substring(4); // Only update pushstate if the view is different (so hitting "Duties" 10 times in a row will not add 10 history states)
                    var shouldPush = isNotHomeRoute && isDifferentState;

                    if (history.pushState) {
                        if (shouldPush) {
                            window.history.pushState({ viewName: viewName, tabRepo: tabRepo }, '', '#' + viewName.substring(4));
                        } else if (isNotHomeRoute) {
                            // When the route is the same as before, just replace the current state
                            // Normally we would not care about this, but when navigating from the main nav (from a different page), the pushState would not get updated
                            // That means when you navigate to one subview and hit "back," the view would not update because it relies on having state data
                            // NOTE: We could add that logic to the main nav links, but this version is less complicated
                            window.history.replaceState({ viewName: viewName, tabRepo: tabRepo }, '', '#' + viewName.substring(4));
                        }
                    }
                    else {
                        if (shouldPush) window.location.hash = '#' + viewName.substring(4); //fallback for pushState
                    }

                    $(".nav-tabs a").off("shown.bs.tab");
                    $(".nav-tabs a").on("shown.bs.tab", function (event) {
                        //if has datatable reset pagination from other loaded views
                        if ($(tabRepo + " table").length > 0) {
                            App.set_pagination_less_more(tabRepo);
                        }
                    });
                }
                App.OnLoadEvent = false;
            });

            //Update page when using the back/foward browser arrows
            window.addEventListener('popstate', function (e) {
                if (e.state && typeof e.state.viewName === "string") {
                    $(".sub-nav a[href='" + e.state.tabRepo + "'], .left-nav-group a[href='" + e.state.tabRepo + "']").trigger("click").focus();
                }
            });
        },
        //Call this function if page doesn't have load views functionality
        no_loading_views: function () {
            //call dataTable Initializer if container has class "contain-dataTable" and it doesn't have [data-load-views]
            if ($('.contain-dataTable').length > 0) {
                App.dataTables_init_settings('.contain-dataTable');
            }
        },
        //Check the url for view parameter and call the load view
        get_url_hash: function () {
            var viewName, //View name
                tabRepo;  //The tab-content it will be loaded into

            //Check if URL has hash
            if (window.location.hash) {
                var getHash = window.location.hash.split("?")[0]; //get the hash and ignore querystring
                //store the view name (remove '#' from hash value)
                viewName = "View" + getHash.substring(1);

                //Check if view exists
                if ($("[data-view = " + viewName + "]").length > 0) {
                    tabRepo = $('[data-view = ' + viewName + ']').attr('href');
                    App.populateTab(viewName, tabRepo);
                }
                else {
                    //If the hash found doesn't match any view on page 
                    //load the default view (first view)
                    App.load_views();
                }
            }
            else {
                App.load_views();
            }
        },
        populateTab: function (name, repo) {
            $(repo).html('<div class="link-row"><div>Loading. Please wait.<br/><img src="/content/assets/img/loading-bar.gif" alt=""></div></div>');
            var callViews = $.get(MyAppUrlSettings[name], function (data) {
                //load view into the right view
                var $insertedData = $(repo).html(data);
            }).done(function () {
                switch (name) {
                    case "ViewFloors":
                        if ($("#floor-actions").length) {
                            $("#floor-actions").load("/Home/ViewFloorActions", function () {
                                if ($(repo + " table").length > 0) {
                                    App.dataTables_init_settings(repo); //run Table init after content is loaded
                                    App.paging_handlers(); //check if it has load more/less functionality
                                    App.fix_externalLinks();
                                    App.set_pagination_less_more(repo);
                                    App.set_last_floor_action();
                                }
                            });
                        }
                        break;
                    case "ViewOverViewContact":
                        document.title = App.pageTitle + " - Overview & Contact";
                        break;
                    case "ViewDutyOfClerk":
                        document.title = App.pageTitle + " - Duties of the Clerk";
                        break;
                    case "ViewOfficeService":
                        document.title = App.pageTitle + " - Office and Service";
                        break;
                    case "ViewHistoryOfOffice":
                        document.title = App.pageTitle + " - History of the Office";
                        break;
                    case "ViewMemberProfiles":
                        setMemberPagination();
                        document.title = App.pageTitle + " - Member Profiles";
                        App.OnLoadEvent = false;
                        break;
                    case "ViewLeadership":
                        if (typeof Ushouse !== "undefined" && typeof Ushouse.MembersLeadershipView === "function") {
                            new Ushouse.MembersLeadershipView();
                        }
                        document.title = App.pageTitle + " - Leadership";
                        break;
                    case "ViewFindRepresentative":
                        var mapContainer = document.getElementById("mapContainer");
                        if (!mapContainer.firstChild) {
                            initializeMap();
                        }
                        break;
                    case "ViewFloorProceedings":
                        if ($("#floor-actions").length) {
                            $("#floor-actions").html('<div class="link-row"><div>Loading. Please wait.<br/><img src="/content/assets/img/loading-bar.gif" alt=""></div></div>');
                            $("#floor-actions").load("/FloorSummary/ViewFloorActions", function () {
                                if ($(repo + " table").length > 0) {
                                    App.dataTables_init_settings(repo); //run Table init after content is loaded
                                    App.paging_handlers(); //check if it has load more/less functionality
                                    App.fix_externalLinks();
                                    App.set_pagination_less_more(repo);
                                    App.set_last_floor_action();
                                }
                            });
                        }
                }
                //Check if content has tables to initialize dataTable
                if ($(repo + " table").length > 0) {
                    App.dataTables_init_settings(repo); //run Table init after content is loaded
                    App.paging_handlers(); //check if it has load more/less functionality
                    App.fix_externalLinks();
                    App.set_pagination_less_more(repo);
                }

                if (App.OnLoadEvent) {
                    if ($("[data-view='" + name + "']").parents(".panel").index() !== 0) {
                        $("a[href='" + repo + "']").trigger("click");
                    }
                }

                if (name === "ViewMemberProfiles" || name === "ViewMemberList" || name === "ViewFindRepresentative") {
                    $(".member-list-icons a").on("click", function (event) {
                        event.preventDefault();
                        var link = $(event.target).closest("a").attr("data-view");
                        $("[data-load-views] a[data-view='" + link + "']").trigger("click");
                    });
                }

                App.currentTab = repo;
                App.load_view_checker();
                App.video_fix();

                //Start Azure videos if visible
                if ($(".azuremediaplayer").length > 0 && $(".azuremediaplayer").is(":visible")) {
                    var videos = $(".azuremediaplayer");
                    App.azureVideo(videos);
                }

                //Start JW Player videos if visible
                if ($(".jwplayer").length > 0 && $(".jwplayer").is(":visible")) {
                    var videos = $(".jwplayer");
                    App.jwplayerVideo(videos);
                }


                //Add the hashtag and pushState
                var isNotHomeRoute = (window.location.pathname !== "/"); // We do not want history states for the tabs on the home page right now
                var isDifferentState = window.location.hash.slice(1) !== name.substring(4); // Only update pushstate if the view is different (so hitting "Duties" 10 times in a row will not add 10 history states)
                var shouldPush = isNotHomeRoute && isDifferentState;
                //Code changes for party links to member profiles(Jyothi)
                if (location.href.split("?")[1]) {
                    partysearchstring = location.href.split("?")[1];
                    if (partysearchstring == "republican" || partysearchstring == "democrat") { shouldPush = false; }
                }

                if (location.search && shouldPush) {
                    // for aligning query string to the end of the url
                    window.history.pushState({ viewName: name, tabRepo: repo }, "", location.href.split("?")[0] + '#' + name.substring(4) + location.search);
                    shouldPush = false;
                }
                if (history.pushState) {
                    if (shouldPush) {
                        window.history.pushState({ viewName: name, tabRepo: repo }, '', '#' + name.substring(4));
                    } else if (isNotHomeRoute) {
                        // When the route is the same as before, just replace the current state
                        // Normally we would not care about this, but when navigating from the main nav (from a different page), the pushState would not get updated
                        // That means when you navigate to one subview and hit "back," the view would not update because it relies on having state data
                        // NOTE: We could add that logic to the main nav links, but this version is less complicated
                        window.history.replaceState({ viewName: name, tabRepo: repo }, '', '#' + name.substring(4));
                    }
                }
                else {
                    if (shouldPush) window.location.hash = name ? '#' + name.substring(4) : ''; //fallback for pushState
                }
                App.set_last_floor_action();
            });
        },
        //load views into tabs
        load_views: function (Name, Repo) {
            //Initial load
            var viewName = Name || (window.innerWidth < 768 ? $('.panel-group a.init').data('view') : $('[data-load-views] a.init').data('view'));
            var tabRepo = Repo || (window.innerWidth < 768 ? $('.panel-group a.init').attr('href') : $('[data-load-views] a.init').attr('href'));
            App.populateTab(viewName, tabRepo);
        },
        //add data-load-views to accordion
        load_view_checker: function () {
            //add data-load-views to accordion
            var checkForLoadViews = $('.panel-group').parent().find('[data-load-views]');
            $('.panel-group').each(function () {
                if (checkForLoadViews) {
                    $('.panel-group').attr('data-load-views', 'true');
                }
                else {
                    $('.panel-group').removeAttr('data-load-views');
                }
            });
        },

        jwplayerVideo: function (videos) {
            var players = [];
            var videoOptions = {
                type: "hls",
                width: "100%",
                height: "100%",
                primary: 'html5',
                hlshtml: true,
                preload: "none",
                autostart: false
            }

            //initiate all videos (add a player to each)
            for (var i = 0, jwplayerLength = videos.length; i < jwplayerLength; i++) {
                var videoId = $(videos[i]).attr("id");
                var videoUrl = $(videos[i]).attr("data-videoUrl");
                initVideos(videoId, videoUrl);
            }

            //Initiate video
            function initVideos(videoId, videoUrl) {
                App.jwplayers.forEach(function (player, i) {
                    player.remove();
                });
                App.jwplayers = [];

                var myPlayer = jwplayer(videoId);
                var hookUrl = function () {
                    videoOptions.file = videoUrl;
                };

                hookUrl();
                myPlayer.setup(videoOptions);

                //myPlayer.onPlay(function () {
                //   myPlayer.setCurrentQuality(0);
                //});

                //push to players array to reuse on play event
                App.jwplayers.push(myPlayer);
            }
        },

        azureVideo: function (videos) {
            var players = [];
            var videoOptions = {
                "logo": {
                    "enabled": false
                },
                "nativeControlsForTouch": false,
                autoplay: false,
                controls: true,
                width: "100%",
                height: "100%",
                poster: "../Content/assets/vendor/azuremediaplayer-2.1.5/assets/icons/poster.png"
            }

            //initiate all videos (add a player to each)
            for (var i = 0, azureLength = videos.length; i < azureLength; i++) {
                var videoId = $(videos[i]).attr("id");
                var videoUrl = $(videos[i]).attr("data-videoUrl");
                initVideos(videoId, videoUrl);
            }

            //Initiate video
            function initVideos(videoId, videoUrl) {
                App.azurePlayers.forEach(function (amp, i) {
                    amp.dispose();
                });
                App.azurePlayers = [];

                var myPlayer = amp(videoId, videoOptions, videoReady);
                var hookUrl = function () {
                    myPlayer.src(
                        {
                            src: videoUrl,
                            type: "application/vnd.ms-sstr+xml",
                            embeddedTracks: [{ format: "CEA608", label: "Captions On", channel: "CC1", srclang: "en" }]
                        }
                    );
                    //myPlayer.addEventListener(amp.eventName.play, _ampEventHandler);
                    //myPlayer.addEventListener(amp.eventName.error, _ampEventHandler);
                };

                hookUrl();

                //push to players array to reuse on play event
                App.azurePlayers.push(myPlayer);
            }

            //when video player is ready
            function videoReady() { }

            //EventHandlers
            function _ampEventHandler(evt) {
                //console.log('test: ', evt, this)
                var _this = this;

                if ("play" == evt.type) {
                    //console.log(_this.id_)
                    App.azurePlayers.forEach(function (ele, i) {
                        if (!ele.paused() && (_this.id_ !== ele.id_)) {
                            ele.pause();
                        }
                    })
                }
                if ("error" == evt.type) {
                    var errorDetails = _this.error();
                    var code = errorDetails.code;
                    var message = errorDetails.message;
                    //console.log('Error code: ', code, ' Error message:', message);
                }
            }
        },
        dataTables_init_settings: function (container) {
            function unescapeHTML(escapedHTML) {
                var decodedHtml;
                try {
                    decodedHtml = escapedHTML.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#039;/g, "'");
                }
                catch (err) {
                    //console.log(err.message);
                }
                return decodedHtml;
            }

            function format(d) {
                var detailRepeat = unescapeHTML(d.detailRepeat);
                var tableStructure =
                    '<table class="hiddenRow" cellpadding="5" cellspacing="0" border="0">' +
                    '<thead>' +
                    // NOTE: I do not know why this was added- the structure should probably be on the server-side (bill view)
                    //'<tr>' +
                    //    '<th class="bill-considered-date empty"></th>' +
                    //    '<th class="bill-considered-time empty"></th>' +
                    //    '<th colspan="4" class="bill-considered-bill"><h5>Activity</h5></th>' +
                    //'</tr>' +
                    '</thead>' + detailRepeat +
                    '</table>';
                return tableStructure;
            }
            $.extend($.fn.dataTable.defaults, {
                //display search and info (use instead of bFilter)
                searching: true,
                //display sort option on columns (use this instead of bSort)
                ordering: true,
                columnDefs: [
                    {
                        orderable: false,
                        targets: "no-sort"
                    }
                ],
                paging: false,
                bLengthChange: false,
                responsive: true,
                language: {
                    search: "<span class='sr-only'>Filter by name or keywords</span>",
                    searchPlaceholder: "Filter by name or keywords",
                    zeroRecords: "0 Results",
                    info: "_TOTAL_ Results",
                    infoEmpty: "0 Results",
                    infoFiltered: " from _MAX_ Total Records",
                    paginate: {
                        "next": "<span class='sr-only'>Next</span>",
                        "previous": "<span class='sr-only'>Previous</span>"
                    }
                },
                pagingType: "simple_numbers",

                fnPreDrawCallback: function (oSettings, json) {
                    $('.dataTables_info').addClass('library-table_info');
                    $('.dataTables_filter').addClass('library-table_filter');
                    $('.dataTables_filter label').addClass('library-table_toolbar-src_label');
                    $('.dataTables_filter input').addClass('library-table_toolbar-src_input');

                    //Add class '.no-filter' to fix table titles issue
                    //This will be added to the tables with data-searching = false 
                    // if(!oSettings.bFiltered){
                    //   this[0].parentElement.parentElement.classList.add('no-filter');
                    // }
                    if (!oSettings.bFiltered) {
                        var elem = this[0].parentElement.parentElement
                        //this[0].parentElement.parentElement.classList.add('no-filter')
                        elem.className += " no-filter";
                    }
                },
                //dom: '<"toolbar"fri>tp'
                dom: 'l<"library-table_toolbar"fi><"table-responsive"t><"library-table_toolbar-footer"p>'
            });

            //Initialize all tables with class ".library-table"
            $(container).find(".library-table.table").each(function (i) {
                //check if bills considered and add the columns to fix view details
                if ($(this).hasClass("has-sub_table")) {
                    var tables = $(this).dataTable({
                        columns: [
                            { "data": "date" },
                            { "data": "time" },
                            { "data": "billNum" },
                            { "data": "fulltext" },
                            { "data": "null" },
                            { "data": "detailRepeat" }]
                    }).addClass("initialized").api();
                }
                else {
                    var tables = $(this).dataTable().addClass("initialized").api();
                }

                //Add Class to main wrapper
                $(tables.table().container()).addClass("library-table_wrapper");

                $(".has-sub_table tbody").on("click", "td.add-sub_table", function () {
                    var tr = $(this).closest("tr");
                    var row = tables.row(tr);
                    if (row.child.isShown()) {
                        row.child.hide();
                        $(this).find("span").text("View Details");
                    }
                    else {
                        row.child(format(row.data())).show();
                        $(this).find("span").text("Hide Details");
                        App.fix_externalLinks();
                    }
                    if (!tr.next().hasClass("even") && !tr.next().hasClass("odd")) {
                        tr.next().addClass("sub_table");
                    }
                });
            });
        },
        //Initialize (show more/show less)
        set_pagination_less_more: function (container) {
            if (App.limitIndex == null) {
                App.limitIndex = $(container + " table").data("limit") || 10;
            }
            $(container + " table.load-more-paging tbody tr").hide();
            $(container + " table.load-more-paging tbody tr").slice(0, App.limitIndex).show();

            $(container).find(".library-table.table").each(function (i) {
                var table = $(this).attr("id");
                var trsLength = $("#" + table + " tbody tr").length,
                    dataLimit = $("#" + table).data("limit") || 10,
                    btnMore = $("[data-table='" + table + "'][data-action = 'more']"),
                    btnLess = $("[data-table='" + table + "'][data-action = 'less']"),
                    btnAll = $("[data-table='" + table + "'][data-action = 'all']");

                if (trsLength <= dataLimit) {
                    btnMore.addClass("hidden");
                    btnAll.addClass("hidden");
                    btnLess.addClass("hidden");
                }
                else {
                    btnMore.removeClass("hidden");
                    btnAll.removeClass("hidden");
                    btnLess.removeClass("hidden");
                }

                var currentLength = $("#" + table + " tbody tr:visible").length;

                if (currentLength >= trsLength) {
                    btnMore.addClass("hidden");
                    btnAll.addClass("hidden");
                }
                else {
                    btnMore.removeClass("hidden");
                    btnAll.removeClass("hidden");
                }

                if (trsLength > dataLimit && currentLength > dataLimit) {
                    btnLess.removeClass("hidden");
                }
                else {
                    btnLess.addClass("hidden");
                }

                $(this).on("order.dt", function () {
                    $("#" + table + ".load-more-paging tbody tr").hide();
                    $("#" + table + ".load-more-paging tbody tr").slice(0, App.limitIndex).show();
                });
            });
        },
        //show more/less funcionality
        custom_bt_pagination: function (table, action) {
            var trs = $("#" + table + " tbody tr"),
                trsLength = trs.length,
                dataLimit = $("#" + table).data("limit") || 10,
                btnMore = $("[data-table='" + table + "'][data-action = 'more']"),
                btnLess = $("[data-table='" + table + "'][data-action = 'less']"),
                btnAll = $("[data-table='" + table + "'][data-action = 'all']");

            // Update data
            if (action == "more") {
                //Show more data and increase limitIndex
                trs.slice(App.limitIndex, App.limitIndex + dataLimit).show();
                App.limitIndex += dataLimit;
            }
            else if (action == "less") {
                //Show less data and decrease limitIndex
                //trs.slice(App.limitIndex - dataLimit, App.limitIndex).hide();
                //App.limitIndex -= dataLimit;

                //EDIT: Reduces the table down to the default entry limit (ex. last 10, rather than increment down 10)
                trs.slice(dataLimit, trsLength).hide();
                App.limitIndex = dataLimit;

                $("html, body").animate({
                    scrollTop: $("#" + table).offset().top
                }, "slow");
            }
            else {
                //Show all
                trs.slice(App.limitIndex, trsLength).show();
                App.limitIndex = trsLength;
            }

            // Update button
            var currentLength = $("#" + table + " tbody tr:visible").length;

            if (currentLength >= trsLength) {
                btnMore.addClass("hidden");
                btnAll.addClass("hidden");
            }
            else {
                btnMore.removeClass("hidden");
                btnAll.removeClass("hidden");
            }

            if (trsLength > dataLimit && currentLength > dataLimit) {
                btnLess.removeClass("hidden");
            }
            else {
                btnLess.addClass("hidden");
            }

            //Scroll to table top
            //$("html, body").animate({
            //   scrollTop: $("#" + table).offset().top
            //}, 1000);
        },
        //Get action (show more/show less) and the table id
        paging_handlers: function () {
            $("body [data-action]").off("click");
            $("body [data-action]").on("click", function (e) {
                var action = $(this).data("action");
                App.custom_bt_pagination($(this).data("table"), action.toString());
            })
        },
        //fix links target
        fix_externalLinks: function () {
            $(".dataTable a").each(function () {
                var hostPattern = new RegExp(window.location.origin);
                var urlPattern = /^((http|https):\/\/)/;
                if (urlPattern.test(this.href) && !hostPattern.test(this.href)) {
                    $(this).attr("target", "_blank");
                }
            });
        },
        video_fix: function () {
            //Video affix
            if (window.innerWidth > 900) {
                $('.video').affix({
                    offset: {
                        top: 60
                    }
                });
            }
        },
        set_last_floor_action: function () {
            if ($("#last-floor-action").length) {
                $("#last-floor-action-datetime").attr("datetime", $("#hidden-last-floor-action-date").val());
                //$("#last-floor-action-datetime").text($("#hidden-last-floor-action-date").val() + " | " + $("#hidden-last-floor-action-time").val());
                $("#last-floor-action-datetime").text($("#hidden-last-floor-action-time").val());
                $("#last-floor-action-desc").html($("#hidden-last-floor-action-desc").val());
            }
        },
        action_refresh_events: function () {
            var floorRows = $("#floor-activity-table tr");

            for (var i = 0, len = floorRows.length; i < len; i++) {
                var actionId = $(floorRows[i]).attr('data-actionId');
                var expander = null;

                if (App.openTextList.indexOf(actionId) !== -1) {
                    expander = $(floorRows[i]).find('.trimmed-content__cutoff-text');
                    expander.prev().toggle();
                    expander.prev().prev().toggle();
                    expander.toggleClass("trimmed-content__cutoff-text--trimmed trimmed-content__cutoff-text--expanded");
                }
            }
        }
    }
}(jQuery));


