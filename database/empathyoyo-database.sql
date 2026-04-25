
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

CREATE TABLE Players (
    id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(255) NOT NULL,
    translatorName NVARCHAR(255) NOT NULL,
    image NVARCHAR(MAX),
    signatureModel NVARCHAR(255),
)
INSERT INTO Players (
    name, translatorName, image, signatureModel
)
VALUES ('kim min joon', '\김민준\', '../src/assets/images/kim-min-joon.png', 'physix')

ALTER TABLE Players
ADD signatureLink VARCHAR(MAX);
UPDATE Players
SET signatureLink = 'https://www.youtube.com/watch?v=qvxflUazl_M'
WHERE ID = 9;

-- Display a whole table
SELECT id, email, password, is_admin FROM Accounts;

-- Display a row
SELECT id, email, LEN(password) as length, is_admin 
FROM Accounts 
WHERE email = 'spidey@gmail.com';

-- Update a row
UPDATE Accounts 
SET password = '$2b$10$rqmB.zi7gKH0osC7VnhQVuOs50gMNx8QxF90DrZFavv.m7QOCdR8e', is_admin = 6
WHERE id = 6;

-- Finda row
SELECT id, email, LEN(password) as password_length, is_admin FROM Accounts WHERE id = 1;

-- Delete a row
DELETE FROM Accounts WHERE id = 6;

-- Update a row
UPDATE Accounts 
SET is_admin = 1 
WHERE email = 'theminhdangcode@gmail.com';

--  Create a table with informations
CREATE TABLE Orders (
    -- 1. Mã đơn hàng (Primary Key)
    [id]            INT             IDENTITY (1, 1) NOT NULL,
    
    -- 2. Thông tin khách hàng
    [customer_id]   INT             NOT NULL, -- Foreign Key trỏ đến Accounts(Id)
    [customer_name] NVARCHAR (255)  NOT NULL, -- Tên khách hàng tại thời điểm mua
    
    -- 3. Thông tin sản phẩm
    [yoyo_id]       INT             NOT NULL, -- Foreign Key trỏ đến Yoyos(id)
    [yoyo_name]     NVARCHAR (255)  NOT NULL, -- Lưu tên để làm lịch sử (tránh việc yoyo đổi tên sau này)
    
    -- 4. Chi tiết giao dịch
    [quantity]      INT             DEFAULT ((1)) NOT NULL,
    [total_price]   DECIMAL (18, 2) NOT NULL, -- (Nên có) Tổng tiền của dòng hàng này
    [date]          DATETIME        DEFAULT (getdate()) NULL,
    
    -- 5. Trạng thái đơn hàng
    -- Ví dụ: 'Pending', 'Completed', 'Cancelled'
    [status]        NVARCHAR (50)   DEFAULT (N'Pending') NULL,

    PRIMARY KEY CLUSTERED ([id] ASC),
    
    -- Thiết lập Khóa ngoại kết nối với bảng Accounts
    CONSTRAINT [FK_Orders_Accounts] FOREIGN KEY ([customer_id]) 
        REFERENCES [dbo].[Accounts] ([Id]),
        
    -- Thiết lập Khóa ngoại kết nối với bảng Yoyos
    CONSTRAINT [FK_Orders_Yoyos] FOREIGN KEY ([yoyo_id]) 
        REFERENCES [dbo].[Yoyos] ([id])
);
-- Delete a table
DROP TABLE Orders;

-- Format getdate() to dd/MM/yyyy
SELECT CONVERT(varchar, GETDATE(), 103) AS FormattedDate;

-- I don't know
sp_help Yoyos

-- UNIQUE checker
SELECT 
    i.name AS index_name,
    c.name AS column_name
FROM sys.indexes i
JOIN sys.index_columns ic ON i.object_id = ic.object_id AND i.index_id = ic.index_id
JOIN sys.columns c ON ic.object_id = c.object_id AND ic.column_id = c.column_id
WHERE i.is_unique = 1
AND OBJECT_NAME(i.object_id) = 'Yoyos';

-- Delete a row from UNIQUE
ALTER TABLE Yoyos
DROP CONSTRAINT UQ__tmp_ms_x__32DD1E4C8C58DB01;
