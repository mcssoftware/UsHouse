var Ushouse;
(function (Ushouse) {
    var MembersLeadershipView = (function () {
        function MembersLeadershipView() {
            var _this = this;
            this.republicans = $('.republican').find('.leadership-box');
            this.democratics = $('.democratic').find('.leadership-box');
            if (this.republicans.length > 0 && this.democratics.length > 0) {
                this.arrangeLeaderShipBox();
                window.onresize = function () {
                    _this.arrangeLeaderShipBox();
                };
            }
        }

        // arranging leader ship box 
        // required only when both republicans and democratics count exist
        MembersLeadershipView.prototype.arrangeLeaderShipBox = function () {
            if (this.republicans.length > 0 && this.democratics.length > 0) {
                var _this = this;
                //for mobile case
                if (window.innerWidth < 768) {
                    if (this.republicans.length > 0)
                        this.resetHeight(_this.republicans.find('figure'));
                    if (this.democratics.length > 0)
                        this.resetHeight(_this.democratics.find('figure'));
                }
                    //for tablet view and above
                else {
                    //taken smaller as arrangement only required to sections in a same row
                    var smallerlength = _this.republicans.length > _this.democratics.length ? _this.democratics.length : _this.republicans.length;

                    for (var i = 0; i < smallerlength; i++) {
                        var republicanFig = _this.republicans.eq(i).find('figure').eq(0);
                        var democraticFig = _this.democratics.eq(i).find('figure').eq(0);

                        var republicanDescription = _this.republicans.eq(i).find('.leadership-box-copy p').eq(0);
                        var democraticDescription = _this.democratics.eq(i).find('.leadership-box-copy p').eq(0);

                        //reset to auto before changing
                        this.resetHeight(republicanFig);
                        this.resetHeight(democraticFig);
                        this.resetHeight(republicanDescription);
                        this.resetHeight(democraticDescription);

                        var reheight = parseInt(republicanFig.height());
                        var deheight = parseInt(democraticFig.height());
                        if (reheight >= deheight) {
                            democraticFig.height(reheight);
                        }
                        else {
                            republicanFig.height(deheight);
                        }
                        reheight = parseInt(republicanDescription.height());
                        deheight = parseInt(democraticDescription.height());
                        if (reheight >= deheight) {
                            democraticDescription.height(reheight);
                        }
                        else {
                            republicanDescription.height(deheight);
                        }
                    }
                };
            }
        }
        //for resetting to the default height 
        MembersLeadershipView.prototype.resetHeight = function (element) {
            element.height('');
        }
        return MembersLeadershipView;
    }());
    Ushouse.MembersLeadershipView = MembersLeadershipView;
})(Ushouse || (Ushouse = {}));