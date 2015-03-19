module.exports = function () {
  $('.primary.wgxc a').hover(function () {
    $('.secondary.wgxc a[href="'+this.pathname+'"]').toggle();
  });
};

