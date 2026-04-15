
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
CREATE TABLE [dbo].[Orders] (
    [id]          INT             IDENTITY (1, 1) NOT NULL,
    [yoyo_id]     INT             NOT NULL,
    [quantity]    INT             NOT NULL,
    [total_price] DECIMAL (18, 2) NOT NULL,
    [order_date]  DATETIME        DEFAULT (getdate()) NULL,
    [status]      NVARCHAR (50)   DEFAULT ('completed') NULL,
    PRIMARY KEY CLUSTERED ([id] ASC),
    FOREIGN KEY ([yoyo_id]) REFERENCES [dbo].[Yoyos] ([id])
);
-- Delete a table
DROP TABLE Orders;