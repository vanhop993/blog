function Post() {
  const base_url =
    location.protocol + "//" + document.domain + ":" + location.port;
  function bindEvent() {
    $(".post_edit").click(() => {
      let params = {
        id: $(".id").val(),
        title: $(".title").val(),
        content: CKEDITOR.instances.editor1.getData(), // lấy giá trị của textarea khi dùng ckeditor
        author: $(".author").val(),
      };
      $.ajax({
        url: base_url + "/admin/post/edit",
        type: "PUT",
        data: params,
        dataType: "json",
        success: function (res) {
          if (res && res.status_code === 200) {
            location.reload();
          }
        },
      });
    });
    $(".post_delete").click(function() {
      const id = $(this).attr("post_id");
      $.ajax({
        url: base_url + "/admin/post/delete",
        type: "DELETE",
        data: { id },
        dataType: "json",
        success: function (res) {
          if (res && res.status_code === 200) {
            location.reload();
          }
        },
      });
    });
  }
  bindEvent();
}

$(document).ready(() => {
  new Post();
});
