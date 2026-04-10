
CREATE TABLE Yoyos (
    id INT PRIMARY KEY IDENTITY(1,1), -- Tự động tăng ID
    name NVARCHAR(255) NOT NULL,      -- Tên Yoyo (hỗ trợ tiếng Việt)
    price DECIMAL(18, 2) NOT NULL,    -- Giá tiền (vdu: 550000.00)
    currencyCode NVARCHAR(10) DEFAULT 'USD',
    image NVARCHAR(MAX),              -- Đường dẫn ảnh
    description NVARCHAR(MAX),
    stock INT DEFAULT 0,
);
ALTER LOGIN sa WITH PASSWORD = '123456aA@';
GO
ALTER LOGIN sa ENABLE;
GO

INSERT INTO Yoyos (
    name, price, image, description, slug
)
VALUES ('new', 990, 'assets/images/empty.jpeg', 'first aa', 'me may beo')