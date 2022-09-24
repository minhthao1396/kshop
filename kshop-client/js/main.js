let sort = null;

$(function () {
    addListeners();
    loadAllCategories();
    loadAllProducts();
});

function addListeners() {
    $('#products-tbody').on('click', 'tr', function (event) {
        if (event.ctrlKey) {
            $(this).toggleClass('selected');
        } else {
            $(this).addClass('selected').siblings().removeClass('selected');
        }
        updateStatus();
    });

    $('#btn-refresh').on('click', function (event) {
        loadAllProducts();
    });

    // Khi người dùng nhấn enter vào ô input page number
    $('#page-number').on('keypress', function (event) {
        // 13 là key code của phím enter
        if (event.which == 13) {
            loadAllProducts();
        }
    });

    // Khi người dùng select page size
    $('#page-size').on('change', function (event) {
        loadAllProducts();
    });

    $('#btn-search').on('click', function (event) {
        loadAllProducts();
    });

    $('#products-thead').on('click', 'th', function (event) {
        $(this).siblings().find('i').removeClass('fa-sort-up fa-sort-down').addClass('fa-sort');

        const i = $(this).find('i');
        if (i.hasClass('fa-sort')) {
            i.removeClass('fa-sort').addClass('fa-sort-up');
        } else {
            i.toggleClass('fa-sort-up fa-sort-down');
        }
        let type = i.hasClass('fa-sort-up') ? 'asc' : 'desc';
        sort = `${$(this).attr('key')},${type}`
        loadAllProducts();
    });

    $('#btn-add').on('click', function (event) {
        $('#modal-title').val('Thêm sản phẩm');
        $('#form-id-container').hide();
        $('#btn-update').hide();
        $('#btn-create').show();
    });

    $('#btn-create').on('click', function (event) {
        $.ajax({
            method: 'POST',
            url: 'http://localhost:8080/api/v1/products',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                name: $('#form-name').val(),
                price: $('#form-price').val(),
                salePrice: $('#form-sale-price').val(),
                thumbnailUrl: $('#form-thumbnail-url').val(),
                description: $('#form-description').val(),
                ram: $('#form-ram').val(),
                categoryId: $('#form-category').val(),
            }),
            success: function () {
                loadAllProducts();
                $('#products-form').trigger("reset");
            }
        });
    });

    $('#btn-edit').on('click', function (event) {
        $('#modal-title').val('Cập nhật sản phẩm');
        $('#form-id-container').show();
        $('#btn-update').show();
        $('#btn-create').hide();

        const row = $('.selected');
        $('#form-id').val(row.find('.id').attr('value'));
        $('#form-name').val(row.find('.name').attr('value'));
        $('#form-price').val(row.find('.price').attr('value'));
        $('#form-sale-price').val(row.find('.salePrice').attr('value'));
        $('#form-thumbnail-url').val(row.find('.thumbnailUrl').attr('value'));
        $('#form-description').val(row.find('.description').text());
        $('#form-ram').val(row.find('.ram').attr('value'));
        $('#form-category').val(row.find('.categoryId').attr('value'));
    });

    $('#btn-update').on('click', function (event) {
        const id = $('#form-id').val();

        $.ajax({
            method: 'PUT',
            url: 'http://localhost:8080/api/v1/products/' + id,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                id: id,
                name: $('#form-name').val(),
                price: $('#form-price').val(),
                salePrice: $('#form-sale-price').val(),
                thumbnailUrl: $('#form-thumbnail-url').val(),
                description: $('#form-description').val(),
                ram: $('#form-ram').val(),
                categoryId: $('#form-category').val(),
            }),
            success: function () {
                loadAllProducts();
                $('#products-form').trigger("reset");
                bootstrap.Modal.getOrCreateInstance($('#modal')).hide();
            }
        });
    });

    $('#btn-delete').on('click', function(event) {
        $('#delete-modal .modal-body').text(
            `Bạn chắc chắn muốn xóa ${$('.selected').length} sản phẩm?`
        );
    });

    $('#btn-remove').on('click', function (event) {
        const cells = $('.selected').find('.id');

        for (const cell of cells) {
            $.ajax({
                method: 'DELETE',
                url: 'http://localhost:8080/api/v1/products/' + cell.innerText,
                beforeSend: function () {
                    showLoading();
                },
                success: function (result) {
                    loadAllProducts();
                },
                complete: function () {
                    hideLoading();
                }
            });
        }

        bootstrap.Modal.getOrCreateInstance($('#delete-modal')).hide();
    });
}

function updateStatus() {
    const length = $('.selected').length;
    if (length == 0) {
        $('#btn-edit').attr('disabled', 'disabled');
        $('#btn-delete').attr('disabled', 'disabled');
    } else if (length == 1) {
        $('#btn-edit').removeAttr('disabled');
        $('#btn-delete').removeAttr('disabled');
    } else {
        $('#btn-edit').attr('disabled', 'disabled');
        $('#btn-delete').removeAttr('disabled');
    }
}

function loadAllCategories() {
    $.ajax({
        method: 'GET',
        url: 'http://localhost:8080/api/v1/categories',
        success: function (result) {
            showAllCategories(result.content);
        }
    });
}

function loadAllProducts() {
    const searchParams = new URLSearchParams();

    let ram = $('#ram').val();
    if (!ram) ram = null;
    let categoryId = $('#categories').val();
    if (!categoryId) categoryId = null;

    const params = {
        page: $('#page-number').val(),
        size: $('#page-size').val(),
        sort: sort,
        search: $('#search').val(),
        ram: ram,
        categoryId: categoryId,
        minYear: $('#min-year').val(),
        maxYear: $('#max-year').val(),
        minCreatedDate: $('#min-created-date').val(),
        maxCreatedDate: $('#max-created-date').val(),
        minSalePrice: $('#min-sale-price').val(),
        maxSalePrice: $('#max-sale-price').val(),
    }
    for (const key in params) {
        if (params[key]) {
            searchParams.set(key, params[key]);
        }
    }

    $.ajax({
        method: 'GET',
        url: 'http://localhost:8080/api/v1/products?' + searchParams,
        beforeSend: function () {
            showLoading();
        },
        success: function (result) {
            showPageInfo(result);
            showAllProducts(result.content);
            updateStatus();
        },
        complete: function () {
            hideLoading();
        }
    });
}

function showAllCategories(categories) {
    const filterSelect = $('#categories');
    const formSelect = $('#form-category');
    for (const category of categories) {
        const option = `
            <option value="${category.id}">${category.name}</option>
        `;
        filterSelect.append(option);
        formSelect.append(option);
    }
}

function showPageInfo(result) {
    const start = result.pageable.offset;
    $('#page-info').text(`Showing ${start + 1} to ${start + result.numberOfElements} of ${result.totalElements} rows.`);
    $('#page-number').attr('max', result.totalPages);
    if (result.last) {
        $('#next').addClass('disabled');
    } else {
        $('#next').removeClass('disabled');
    }
    if (result.first) {
        $('#previous').addClass('disabled');
    } else {
        $('#previous').removeClass('disabled');
    }
}

function showAllProducts(products) {
    const tbody = $('#products-tbody');
    tbody.empty();
    for (const product of products) {
        tbody.append(`
            <tr>
                <th class='id' value='${product.id}' scope="row">${product.id}</th>
                <td class='name' value='${product.name}'>${product.name}</td>
                <td class='ram' value='${product.ram}'>${product.ram}</td>
                <td class='price' value='${product.price}'>${product.price.toLocaleString('vi-VN')}₫</td>
                <td class='salePrice' value='${product.salePrice}'>${product.salePrice.toLocaleString('vi-VN')}₫</td>
                <td class='description'>${product.description}</td>
                <td class='thumbnailUrl' value='${product.thumbnailUrl}'>
                    <img src="${product.thumbnailUrl}" width="80">
                </td>
                <td class='createdDate'>${product.createdDate}</td>
                <td class='updatedDate'>${product.updatedDate}</td>
                <td class='categoryId' value='${product.category.id}'>${product.category.name}</td>
            </tr>
        `);
    }
}

function showLoading() {
    $('#loading').show();
}

function hideLoading() {
    $('#loading').hide();
}

function changePageNumber(value) {
    const page = $('#page-number');
    page.val(+page.val() + value);
    loadAllProducts();
}
