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
    <link rel="stylesheet" href="{{ asset('css/welcome.css') }}" />
    <link rel="stylesheet" href="{{ asset('css/general.css') }}" />
    <link rel='stylesheet'
        href='https://cdn-uicons.flaticon.com/3.0.0/uicons-solid-straight/css/uicons-solid-straight.css'>
    <meta name="csrf-token" content="{{ csrf_token() }}">
</head>

<body>
    <video autoplay muted loop id="bg-video">
        <source src="{{ asset('videos/technology.mp4') }}" type="video/mp4" />
        Tu navegador no soporta video HTML5.
    </video>

    <nav class="navbar navbar-expand-lg navbar-dark fixed-top navbar-transparent">
        <div class="container">
            <a class="navbar-brand font-bold" href="#">Daxcsa Tree Viewer</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item"><a class="nav-link active font-bold" href="#">Home</a></li>
                    <li class="nav-item"><a class="nav-link font-light" href="#tree-section">Tree</a></li>
                    <li class="nav-item"><a class="nav-link font-light" href="#contact-section">Contact</a></li>
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
                    <div class="col-md-6 col-12">
                        <h1 class="text-white font-bold animate__animated animate__fadeInLeft">
                            <span class="gradient-text">Welcome</span> to Daxcsa Binary Genealogy Tree Viewer
                        </h1>
                        <p class="font-light text-white">
                            This app graphically displays a binary family tree based on a JSON structure provided by
                            Daxcsa.
                        </p>
                        <button class="btn btn-primary gradient-btn animate__animated animate__bounce"
                            id="see-tree-btn">
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
                        @if (!$hasDistributors)
                            <p class="purple-text font-light p-0 m-0">Create your own</p>
                            <h2 class="font-bold mb-5">Binary Tree Visualization</h2>
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
                        @else
                            <p class="purple-text font-light p-0 m-0 cursor-pointer" onclick="confirmRestart()">Start
                                Over</p>

                            <h2 class="font-bold mb-5">Binary Tree Visualization</h2>
                            <div id="tree-container" class="text-white mt-4"></div>
                        @endif
                    </div>
                </div>
            </div>
            <button id="back-to-top" aria-label="Back to top" title="Back to top">↑</button>

        </section>
        <section id="contact-section">
            <footer style="background-color: #000; color: #fff; padding: 20px 0; text-align: center;">
                <div class="container">
                    <p><strong>Dannya Montserrat Martínez Ramírez</strong></p>
                    <p>Email: <a href="mailto:montserrat.mr28@gmail.com"
                            style="color: #fff; text-decoration: underline;">montserrat.mr28@gmail.com</a></p>
                    <p>Phone: 4444325572</p>
                    <p>Soledad de Graciano Sánchez, S.L.P</p>
                    <p>Thank you for considering me!</p>

                </div>
            </footer>
        </section>

    </div>

    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.7/dist/umd/popper.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-OERcA2EqjJCMA+/3y+gxD3F5rJkBnt/6MlQdqUlI6U8zWvZf4l+uHlr8JXZSmHJA" crossorigin="anonymous">
    </script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script>
        window.treeDataUrl = "{{ url('/tree-data') }}";
    </script>
    <script src="{{ asset('js/welcome.js') }}"></script>
</body>

</html>
