module.exports = function () {
  $('.primary.wgxc a').hover(function () {
    console.log(this.pathname);
    $('.secondary.wgxc a[href="'+this.pathname+'"]').toggle();
  });
};
