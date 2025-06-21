document.addEventListener("DOMContentLoaded", function () {
    fetch(window.treeDataUrl)
        .then((res) => res.json())
        .then((data) => {
            const distributors = data.distributors;
            const relationships = data.relationships;

            const treeMap = {};
            relationships.forEach((rel) => {
                if (!treeMap[rel.parent_id]) {
                    treeMap[rel.parent_id] = [];
                }
                treeMap[rel.parent_id].push({
                    id: rel.child_id,
                    placement: rel.binary_placement,
                });
            });

            const childIds = relationships.map((r) => r.child_id);
            const rootNodes = Object.values(distributors).filter(
                (d) => !childIds.includes(d.id)
            );

            const container = document.getElementById("tree-container");
            container.innerHTML = "";

            const expandedButtonsByLevel = {};

            function toggleChildren(btn, node, parentElem, level) {
                let isExpanded = false;

                btn.addEventListener("click", () => {
                    if ( expandedButtonsByLevel[level] && expandedButtonsByLevel[level] !== btn) {
                        const prevBtn = expandedButtonsByLevel[level];
                        prevBtn.textContent = "Show Children";
                        prevBtn.classList.remove("btn-hide-children");
                        prevBtn.classList.add("btn-show-children");

                        const prevCard = prevBtn.closest(".card");
                        if (prevCard) {
                            prevCard.classList.remove("card-with-children");
                        }

                        document
                            .querySelectorAll(`[data-level]`)
                            .forEach((el) => {
                                if (parseInt(el.dataset.level) > level)
                                    el.remove();
                            });

                        expandedButtonsByLevel[level] = null;
                    }

                    if (isExpanded) {
                        document
                            .querySelectorAll(`[data-level]`)
                            .forEach((el) => {
                                if (parseInt(el.dataset.level) > level)
                                    el.remove();
                            });
                        btn.textContent = "Show Children";
                        btn.classList.remove("btn-hide-children");
                        btn.classList.add("btn-show-children");
                        const card = btn.closest(".card");
                        if (card) card.classList.remove("card-with-children");
                        isExpanded = false;
                        expandedButtonsByLevel[level] = null;
                    } else {
                        const children = treeMap[node.id] || [];

                        const sortedChildren = ["Left", "Right"]
                            .map((side) =>
                                children.find(
                                    (child) => child.placement === side
                                )
                            )
                            .filter(Boolean)
                            .map((child) => ({
                                ...distributors[child.id],
                                binary_placement: child.placement,
                            }));

                        const childrenRow = renderChildrenRow(
                            sortedChildren,
                            parentElem,
                            level + 1
                        );

                        childrenRow.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                        });

                        btn.textContent = "Hide Children";
                        btn.classList.remove("btn-show-children");
                        btn.classList.add("btn-hide-children");
                        const card = btn.closest(".card");
                        if (card) card.classList.add("card-with-children");
                        isExpanded = true;
                        expandedButtonsByLevel[level] = btn;
                    }
                });
            }

            function showNodeInfoModal(node) {
                const modalHtml = `
                <div class="modal fade show d-block" tabindex="-1" role="dialog">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header gradient-bg text-white">
                                <h5 class="modal-title font-bold">${
                                    node.full_name
                                }</h5>
                                <button type="button" class="btn-close" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <p><strong>Username:</strong> ${
                                    node.username
                                }</p>
                                <p><strong>Status:</strong> ${node.status}</p>
                                <p><strong>Product:</strong> ${
                                    node.product_name || "N/A"
                                }</p>
                                <p><strong>Category:</strong> ${
                                    node.category_name || "N/A"
                                }</p>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary">Close</button>
                            </div>
                        </div>
                    </div>
                </div>`;

                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = modalHtml.trim();
                const modalElem = tempDiv.firstChild;

                document.body.appendChild(modalElem);

                function closeModal() {
                    modalElem.classList.remove("show", "d-block");
                    modalElem.style.background = "transparent";
                    modalElem.remove();
                }

                modalElem
                    .querySelector(".btn-close")
                    .addEventListener("click", closeModal);
                modalElem
                    .querySelector(".btn-secondary")
                    .addEventListener("click", closeModal);
                modalElem.addEventListener("click", (e) => {
                    if (e.target === modalElem) closeModal();
                });
            }

            function renderSingleNode(node, parentElem, level = 0) {
                const row = document.createElement("div");
                row.className =
                    "row justify-content-center mb-4 tree-row position-relative";
                row.dataset.level = level;

                const col = document.createElement("div");
                col.className = "col-md-3 col-12";

                const card = document.createElement("div");
                card.className =
                    "card p-3 mb-5 text-center position-relative card-connector";

                const hasChildren =
                    treeMap[node.id] && treeMap[node.id].length > 0;

                card.innerHTML = `
                <img src="/images/profile.png" alt="profile" class="mx-auto d-block profile-img-position">
                <h5 class="font-bold mt-3" style="cursor:pointer; text-decoration:none;">${
                    node.full_name
                }</h5>
                ${
                    hasChildren
                        ? `<button id="btn-${node.id}" class="btn-show-children btn btn-sm mt-2">Show Children</button>`
                        : ""
                }
            `;

                col.appendChild(card);
                row.appendChild(col);
                parentElem.appendChild(row);

                const nameElem = card.querySelector("h5");
                nameElem.addEventListener("click", () =>
                    showNodeInfoModal(node)
                );

                if (hasChildren) {
                    const btn = document.getElementById(`btn-${node.id}`);
                    toggleChildren(btn, node, parentElem, level);
                }
            }

            function renderChildrenRow(nodes, parentElem, level) {
                const row = document.createElement("div");
                row.className =
                    "row justify-content-center mb-4 tree-row position-relative";
                row.dataset.level = level;

                const connectorLine = document.createElement("div");
                connectorLine.className = "tree-connector";
                connectorLine.style.width = `${nodes.length * 25}%`;
                connectorLine.style.left = `${(100 - nodes.length * 25) / 2}%`;
                row.appendChild(connectorLine);

                nodes.forEach((node) => {
                    const col = document.createElement("div");
                    col.className =
                        node.binary_placement === "Left"
                            ? "col-md-3 col-12 order-1"
                            : "col-md-3 col-12 order-2";

                    const card = document.createElement("div");
                    card.className =
                        "card p-3 mb-5 text-center position-relative card-connector";

                    const hasChildren =
                        treeMap[node.id] && treeMap[node.id].length > 0;

                    card.innerHTML = `
                    <img src="/images/profile.png" alt="profile" class="mx-auto d-block profile-img-position">
                    <h5 class="font-bold mt-3" style="cursor:pointer; text-decoration:none;">${
                        node.full_name
                    }</h5>
                    ${
                        hasChildren
                            ? `<button id="btn-${node.id}" class="btn-show-children btn btn-sm mt-2">Show Children</button>`
                            : ""
                    }
                `;

                    col.appendChild(card);
                    row.appendChild(col);

                    const nameElem = card.querySelector("h5");
                    nameElem.addEventListener("click", () =>
                        showNodeInfoModal(node)
                    );

                    if (hasChildren) {
                        const btn = card.querySelector(`#btn-${node.id}`);
                        toggleChildren(btn, node, parentElem, level);
                    }
                });

                parentElem.appendChild(row);
                return row;
            }

            if (rootNodes.length > 0) {
                renderSingleNode(rootNodes[0], container);
            } else {
                container.innerHTML = "<p>No distributors found</p>";
            }
        })
        .catch((error) => {
            console.error("Error generating tree:", error);
        });
});

const seeTreeBtn = document.getElementById("see-tree-btn");
if (seeTreeBtn) {
    seeTreeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        document
            .getElementById("tree-section")
            .scrollIntoView({ behavior: "smooth" });
    });
}

["#tree-section", "#contact-section"].forEach((sectionId) => {
    document.querySelectorAll(`a[href^="${sectionId}"]`).forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute("href"));
            if (target) {
                target.scrollIntoView({ behavior: "smooth" });
            }
        });
    });
});

const fileInput = document.getElementById("file-upload");
const uploadLabel = document.getElementById("upload-label");
const sendBtn = document.getElementById("send-btn");
const loadingSpinner = document.getElementById("loading-spinner");

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

    const closeIcon = uploadLabel.querySelector(".close-icon");
    closeIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        resetUploadLabel();
        sendBtn.style.display = "none";
    });

    sendBtn.style.display = "inline-block";
}

function resetUploadLabel() {
    uploadLabel.innerHTML = `
        <i class="fi fi-ss-cloud-upload-alt upload-icon"></i>
        <div class="file-upload-text">
            <p class="mb-0 font-light">Click or drag and drop your JSON file here to upload</p>
        </div>
    `;
    uploadLabel.appendChild(fileInput);
    fileInput.value = "";
}

if (fileInput) {
    fileInput.addEventListener("change", () => {
        if (fileInput.files.length > 0) {
            renderSelected();
        } else {
            resetUploadLabel();
            sendBtn.style.display = "none";
        }
    });
}

const uploadForm = document.getElementById("upload-form");

if (uploadForm) {
    uploadForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!fileInput.files.length) return;

        sendBtn.style.display = "none";
        loadingSpinner.classList.remove("d-none");

        const formData = new FormData();
        formData.append("file", fileInput.files[0]);

        try {
            const response = await fetch("/generateTree", {
                method: "POST",
                headers: {
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
                body: formData,
            });

            if (response.ok) {
                location.reload();
            } else {
                alert("Upload failed.");
                sendBtn.style.display = "inline-block";
                loadingSpinner.classList.add("d-none");
            }
        } catch (error) {
            alert("Error uploading file.");
            console.error(error);
            sendBtn.style.display = "inline-block";
            loadingSpinner.classList.add("d-none");
        }
    });
}

function confirmRestart() {
    Swal.fire({
        title: "Do you want to start over?",
        text: "This will delete all distributors",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, start over",
        cancelButtonText: "No, cancel",
    }).then((result) => {
        if (result.isConfirmed) {
            fetch("/reset-tree", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.querySelector(
                        'meta[name="csrf-token"]'
                    ).content,
                },
            })
                .then((res) => {
                    if (res.ok) {
                        Swal.fire(
                            "Reset!",
                            "All data has been deleted.",
                            "success"
                        ).then(() => {
                            location.reload();
                        });
                    } else {
                        Swal.fire(
                            "Error",
                            "There was a problem deleting the data.",
                            "error"
                        );
                    }
                })
                .catch(() => {
                    Swal.fire(
                        "Error",
                        "There was a problem contacting the server.",
                        "error"
                    );
                });
        }
    });
}
document
    .querySelector(".navbar-toggler")
    .addEventListener("click", function () {
        const nav = document.getElementById("navbarNav");
        nav.classList.toggle("show");
    });

document.getElementById("back-to-top").addEventListener("click", function () {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
});
