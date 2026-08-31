function changeColor(event) {
    var element = event.target;
    element.classList.toggle('clicked');
    syncHeartWithLike(element);
}

function likeColor(event) {
    var element = event.target;
    element.classList.toggle('saved');
}

function syncHeartWithLike(heartElement) {
    var box = heartElement.closest('.box');
    if (!box) return;
    var likesCount = box.querySelector('.likes-count');
    if (!likesCount) return;
    var liked = heartElement.classList.contains('clicked');
    likesCount.textContent = liked ? 'A ti y a otros les gusta esto' : 'Sé el primero en decir que te gusta';
}

function burstHeart(box) {
    var heart = box.querySelector('.heart-burst');
    if (!heart) return;
    heart.classList.remove('animate');
    // Force reflow so the animation can be re-triggered on repeated double clicks.
    void heart.offsetWidth;
    heart.classList.add('animate');
}

function likePost(box) {
    var heartIcon = box.querySelector('[onclick="changeColor(event)"]');
    if (heartIcon && !heartIcon.classList.contains('clicked')) {
        heartIcon.classList.add('clicked');
        syncHeartWithLike(heartIcon);
    }
    burstHeart(box);
}

function enhancePost(box, index) {
    // Post header with avatar + "Day N" username, Instagram style.
    if (!box.querySelector('.post-header')) {
        var header = document.createElement('div');
        header.className = 'post-header';
        header.innerHTML =
            '<span class="post-avatar"><img src="./img/logo_our_world.png" alt="avatar"></span>' +
            '<span class="post-username">Dia ' + (index + 1) + '</span>' +
            '<span class="material-symbols-outlined post-options">more_horiz</span>';
        box.insertBefore(header, box.firstChild);
    }

    // Wrap the figure image so the double-tap heart animation can be positioned over it.
    var figure = box.querySelector('figure');
    var img = figure ? figure.querySelector('img') : null;
    if (figure && img && !img.closest('.figure-wrapper')) {
        var wrapper = document.createElement('div');
        wrapper.className = 'figure-wrapper';
        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);

        var heartBurst = document.createElement('span');
        heartBurst.className = 'material-symbols-outlined heart-burst';
        heartBurst.textContent = 'favorite';
        wrapper.appendChild(heartBurst);

        img.addEventListener('dblclick', function () {
            likePost(box);
        });
    }

    // Likes count line, Instagram style, placed under the interaction icons.
    if (!box.querySelector('.likes-count')) {
        var likes = document.createElement('p');
        likes.className = 'likes-count';
        likes.textContent = 'Sé el primero en decir que te gusta';
        var interact = box.querySelector('.interact-seccion');
        if (interact) {
            interact.insertAdjacentElement('afterend', likes);
        } else {
            box.appendChild(likes);
        }
    }

    box.dataset.postId = box.dataset.postId || 'memory-' + (index + 1);
    addCommentForm(box);
}

function addCommentForm(box) {
    if (box.querySelector('.comment-area')) return;

    var comments = document.createElement('div');
    comments.className = 'comment-area';
    var list = document.createElement('div');
    list.className = 'comment-list';
    var form = document.createElement('form');
    form.className = 'comment-form';
    form.innerHTML =
        '<label class="sr-only" for="comment-' + box.dataset.postId + '">Añade un comentario</label>' +
        '<input id="comment-' + box.dataset.postId + '" name="comment" maxlength="180" placeholder="Añade un comentario..." autocomplete="off">' +
        '<button type="submit">Publicar</button>';
    comments.appendChild(list);
    comments.appendChild(form);
    box.appendChild(comments);

    var storedComments = JSON.parse(localStorage.getItem(box.dataset.postId + '-comments') || '[]');
    storedComments.forEach(function (comment) {
        renderComment(list, comment);
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        var input = form.elements.comment;
        var text = input.value.trim();
        if (!text) return;
        var savedComments = JSON.parse(localStorage.getItem(box.dataset.postId + '-comments') || '[]');
        savedComments.push(text);
        localStorage.setItem(box.dataset.postId + '-comments', JSON.stringify(savedComments));
        renderComment(list, text);
        input.value = '';
    });
}

function renderComment(list, text) {
    var comment = document.createElement('p');
    comment.className = 'comment';
    comment.textContent = text;
    list.appendChild(comment);
}

function addPhoto(event) {
    var file = event.target.files[0];
    if (!file || !file.type.startsWith('image/')) return;

    var reader = new FileReader();
    reader.addEventListener('load', function () {
        var photo = { id: 'user-photo-' + Date.now(), src: reader.result };
        var photos = JSON.parse(localStorage.getItem('user-photos') || '[]');
        photos.push(photo);
        localStorage.setItem('user-photos', JSON.stringify(photos));
        addUserPhoto(photo);
        event.target.value = '';
    });
    reader.readAsDataURL(file);
}

function addUserPhoto(photo) {
    var box = document.createElement('article');
    box.className = 'first-contain box user-post';
    box.dataset.postId = photo.id;
    box.innerHTML =
        '<div class="post-header"><span class="post-avatar">♥</span><span class="post-username">Tu recuerdo</span></div>' +
        '<figure><div class="figure-wrapper"><img src="' + photo.src + '" alt="Foto añadida por ti"></div><figcaption>Un recuerdo nuevo</figcaption></figure>' +
        '<div class="interact-seccion"><ul class="interact-seccion-left"><li><span class="material-symbols-outlined" onclick="changeColor(event)">favorite</span></li><li><span class="material-symbols-outlined" onclick="likeColor(event)">bookmark</span></li></ul></div>';
    document.querySelector('.main-section').prepend(box);
    enhancePost(box, 0);
}

function addPhotoPicker() {
    var section = document.querySelector('.main-section');
    if (!section || document.querySelector('.photo-picker')) return;
    var picker = document.createElement('div');
    picker.className = 'photo-picker';
    picker.innerHTML = '<span><strong>Tu historia</strong><small>Añade una foto desde tu teléfono</small></span><label for="photo-input"><span class="material-symbols-outlined">add_a_photo</span><span>Añadir foto</span></label><input id="photo-input" class="sr-only" type="file" accept="image/*">';
    section.prepend(picker);
    picker.querySelector('input').addEventListener('change', addPhoto);
}

document.addEventListener('DOMContentLoaded', function () {
    var boxes = document.querySelectorAll('.main-section .box');
    boxes.forEach(function (box, index) {
        enhancePost(box, index);
    });
    addPhotoPicker();
    JSON.parse(localStorage.getItem('user-photos') || '[]').forEach(addUserPhoto);
});
