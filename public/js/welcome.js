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

            function toggleChildren(btn, node, parentElem, level) {
                let isExpanded = false;
                let childrenRow = null;

                btn.addEventListener("click", () => {
                    if (isExpanded) {
                        document.querySelectorAll(`[data-level]`).forEach(el => {
                            if (parseInt(el.dataset.level) > level) el.remove();
                        });
                        btn.textContent = "Mostrar hijos";
                        isExpanded = false;
                    } else {
                        document.querySelectorAll(`[data-level]`).forEach(el => {
                            if (parseInt(el.dataset.level) > level) el.remove();
                        });

                        const children = treeMap[node.id] || [];
                        const childrenNodes = children.map(c => distributors[c.id]).filter(Boolean);

                        childrenRow = renderChildrenRow(childrenNodes, parentElem, level + 1);
                        btn.textContent = "Ocultar hijos";
                        isExpanded = true;
                    }
                });
            }

            function renderSingleNode(node, parentElem, level = 0) {
                const row = document.createElement("div");
                row.className = "row justify-content-center mb-4";
                row.dataset.level = level;

                const col = document.createElement("div");
                col.className = "col-3";

                const card = document.createElement("div");
                card.className = "card p-3 text-center";

                const hasChildren = treeMap[node.id] && treeMap[node.id].length > 0;

                card.innerHTML = `
                    <h5>${node.full_name}</h5>
                    <small>${node.username}</small>
                    <p class="mb-1"><strong>Status:</strong> ${node.status}</p>
                    <p class="mb-1"><strong>Product:</strong> ${node.product_name || "N/A"}</p>
                    ${hasChildren ? `<button id="btn-${node.id}" class="btn btn-sm btn-outline-primary mt-2">Mostrar hijos</button>` : ""}
                `;

                col.appendChild(card);
                row.appendChild(col);
                parentElem.appendChild(row);

                if (hasChildren) {
                    const btn = document.getElementById(`btn-${node.id}`);
                    toggleChildren(btn, node, parentElem, level);
                }
            }

            function renderChildrenRow(nodes, parentElem, level) {
                const row = document.createElement("div");
                row.className = "row justify-content-center mb-4";
                row.dataset.level = level;

                nodes.forEach((node) => {
                    const col = document.createElement("div");
                    col.className = "col-3";

                    const card = document.createElement("div");
                    card.className = "card p-3 text-center";

                    const hasChildren = treeMap[node.id] && treeMap[node.id].length > 0;

                    card.innerHTML = `
                        <h6>${node.full_name}</h6>
                        <small>${node.username}</small>
                        <p class="mb-1"><strong>Status:</strong> ${node.status}</p>
                        <p class="mb-1"><strong>Product:</strong> ${node.product_name || "N/A"}</p>
                        ${hasChildren ? `<button id="btn-${node.id}" class="btn btn-sm btn-outline-primary mt-2">Mostrar hijos</button>` : ""}
                    `;

                    col.appendChild(card);
                    row.appendChild(col);

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
                container.innerHTML = "<p>No hay distribuidores raíz</p>";
            }
        })
        .catch((error) => {
            console.error("Error generating tree:", error);
        });
});


document.getElementById("see-tree-btn").addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("tree-section").scrollIntoView({
        behavior: "smooth",
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
                alert("Okay");
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
