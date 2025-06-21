<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Daxcsa Binary Genealogy Tree</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
    <link rel="stylesheet" href="{{ asset('welcome.css') }}" />
    <link rel="stylesheet" href="{{ asset('css/general.css') }}" />
    <link rel='stylesheet'
        href='https://cdn-uicons.flaticon.com/3.0.0/uicons-solid-straight/css/uicons-solid-straight.css'>
</head>

<body>
    <video autoplay muted loop id="bg-video">
        <source src="{{ asset('videos/technology.mp4') }}" type="video/mp4" />
        Tu navegador no soporta video HTML5.
    </video>

    <nav class="navbar navbar-expand-lg navbar-dark fixed-top navbar-transparent">
        <div class="container">
            <a class="navbar-brand" href="#">Daxcsa Tree Viewer</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item"><a class="nav-link active" href="#">Home</a></li>
                    <li class="nav-item"><a class="nav-link" href="#">About</a></li>
                    <li class="nav-item"><a class="nav-link" href="#">Contact</a></li>
                </ul>
            </div>
        </div>
    </nav>
    <div class="glow-base top-glow"></div>
    <div class="glow-base top-glow2"></div>
    <div class="content">
        <section>
            <div class="container full-height d-flex align-items-center">
                <div class="row">
                    <div class="col-6">
                        <h1 class="text-white font-bold animate__animated animate__fadeInLeft">
                            <span class="gradient-text">Welcome</span> to Daxcsa Binary Genealogy Tree Viewer
                        </h1>
                        <p class="font-light text-white">
                            This app graphically displays a binary family tree based on a JSON structure provided by
                            Daxcsa.
                        </p>
                        <button class="btn btn-primary gradient-btn" id="see-tree-btn">
                            See tree
                        </button>
                    </div>
                </div>
            </div>
        </section>
        <section id="tree-section">
            <div class="container">
                <div class="row">
                    <div class="col-12 text-center">
                        <p class="text-purple p-0 m-0">Create your own</p>
                        <h2 class="font-bold mb-4">Binary Tree Visualization</h2>
                        <form id="upload-form" class="upload-form">
                            <div class="p-4">
                                <label for="file-upload" id="upload-label" class="file-upload-label m-0 p-0 mb-2">
                                    <i class="fi fi-ss-cloud-upload-alt upload-icon"></i>
                                    <input type="file" id="file-upload" class="d-none" accept=".json" />
                                    <div id="upload-text" class="file-upload-text">
                                        <p>Click or drag and drop your JSON file here to upload</p>
                                    </div>
                                </label>
                                <button type="submit" id="send-btn"
                                    class="btn btn-primary gradient-btn send-btn">Send</button>
                                <div id="loading-spinner" class="d-none mt-3">
                                    <div class="spinner-border text-primary" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                    <p class="mt-2 text-white">Uploading...</p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>

    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-OERcA2EqjJCMA+/3y+gxD3F5rJkBnt/6MlQdqUlI6U8zWvZf4l+uHlr8JXZSmHJA" crossorigin="anonymous">
    </script>
    <script>
        document.getElementById('see-tree-btn').addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('tree-section').scrollIntoView({
                behavior: 'smooth'
            });
        });

        const fileInput = document.getElementById('file-upload');
        const uploadLabel = document.getElementById('upload-label');
        const sendBtn = document.getElementById('send-btn');
        const loadingSpinner = document.getElementById('loading-spinner');

        function renderSelected() {
            uploadLabel.innerHTML = `
                <span class="upload-icon-with-close">
                    <i class="fi fi-ss-file upload-icon"></i>
                    <span class="close-icon" title="Clear selection">&#10006;</span>
                </span>
                <div class="file-upload-text">
                    <p class="mb-0">JSON file selected</p>
                </div>
            `;

            uploadLabel.appendChild(fileInput);

            const closeIcon = uploadLabel.querySelector('.close-icon');
            closeIcon.addEventListener('click', e => {
                e.stopPropagation();
                resetUploadLabel();
                sendBtn.style.display = 'none';
            });

            sendBtn.style.display = 'inline-block';
        }

        function resetUploadLabel() {
            uploadLabel.innerHTML = `
        <i class="fi fi-ss-cloud-upload-alt upload-icon"></i>
        <div class="file-upload-text">
            <p class="mb-0">Click or drag and drop your JSON file here to upload</p>
        </div>
    `;

            uploadLabel.appendChild(fileInput);

            fileInput.value = '';
        }

        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                renderSelected();
            } else {
                resetUploadLabel();
                sendBtn.style.display = 'none';
            }
        });

        document.getElementById('upload-form').addEventListener('submit', e => {
            e.preventDefault();

            if (!fileInput.files.length) return;

            sendBtn.style.display = 'none';
            loadingSpinner.classList.remove('d-none');

            setTimeout(() => {
                location.reload();
            }, 2500);
        });
    </script>
</body>

</html>
