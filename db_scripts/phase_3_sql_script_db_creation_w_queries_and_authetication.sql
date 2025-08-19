-- SQL Script 
/*  ********************************  
    Project Phase II
    Project: "Airport System Application Project" 
    Group: Team 11
    @ Author: Kirill Grichanichenko and Artem Grichanichenko
    This SQL Script was tested on MySQL Workbench using MySQL
    ********************************  
*/

-- ************************************ --
--  Create airport_system_db database 	--
-- ************************************ --
CREATE DATABASE IF NOT EXISTS airport_system_db;
USE airport_system_db;

-- ************************************ --
--               Part A                 --
-- There are 9 tables for our database --
-- ************************************ --

-- 1. Create Airport_Location Table
-- Purpose: Holds Airport location Data.
CREATE TABLE IF NOT EXISTS airport_location
(
    	location_zip BIGINT,
    	city VARCHAR(255) NOT NULL,
    	state VARCHAR(255) NOT NULL,
    	PRIMARY KEY (location_zip)
);

-- 2. Create Airport Table
-- Purpose: Holds Airport Data.
CREATE TABLE IF NOT EXISTS airport
(
    	airport_id BIGINT AUTO_INCREMENT,
    	airport_name VARCHAR(255) NOT NULL,
    	code VARCHAR(10) NOT NULL UNIQUE,
    	location_zip BIGINT NOT NULL,
    	PRIMARY KEY (airport_id),
    	CONSTRAINT fk_airport_location
    		FOREIGN KEY (location_zip) REFERENCES airport_location(location_zip)
    		ON DELETE RESTRICT -- Prevent deletion
    		ON UPDATE CASCADE -- Update location of airports
);


-- 3. Create Customer Table
-- Purpose: Holds Customer Data.
CREATE TABLE IF NOT EXISTS customer
(
	user_id BIGINT AUTO_INCREMENT,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL DEFAULT 'N/A',
    passport_number VARCHAR(20) UNIQUE,
    PRIMARY KEY (user_id),
    CONSTRAINT chk_validation_email CHECK (email LIKE '%@%.%'),
    CONSTRAINT chk_name_length CHECK (LENGTH(first_name) >= 2 AND LENGTH(last_name) >= 2)
);

-- 3. Create Authetication Table
-- Purpose: Holds Customer login information.
CREATE TABLE IF NOT EXISTS authentication
(
	authentication_id BIGINT AUTO_INCREMENT,
	user_id BIGINT NOT NULL UNIQUE,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (authentication_id),
	CONSTRAINT fk_authetication
		FOREIGN KEY (user_id) REFERENCES customer(user_id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

-- 4. Create Class Table
-- Purpose: Holds Seat Class Data.
CREATE TABLE IF NOT EXISTS class
(
    class_type VARCHAR(255) NOT NULL UNIQUE,
    seat_price DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (class_type)
);

-- 7. Create Seat Table
-- Purpose: Holds Seat Data.
CREATE TABLE IF NOT EXISTS seat
(
		seat_number VARCHAR(20) NOT NULL,
    	class_type VARCHAR(255) NOT NULL,
    	PRIMARY KEY (seat_number),
    	CONSTRAINT fk_seat_class_type
    		FOREIGN KEY (class_type) REFERENCES class(class_type)
    		ON DELETE RESTRICT
    		ON UPDATE CASCADE
);

-- 6. Create Flight Table
-- Purpose: Holds Flight Data.
CREATE TABLE IF NOT EXISTS flight
(
	flight_number VARCHAR(255),
    airline VARCHAR(255) NOT NULL,
    departure_airport_id BIGINT NOT NULL,
    arrival_airport_id BIGINT NOT NULL,
    boarding_time DATETIME NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    gate_number varchar(255),
    PRIMARY KEY(flight_number),
    UNIQUE (departure_airport_id, gate_number), -- No flights can share the same gate at the same airport. Future work can include propery time management with gate sharing with similar airports
    CONSTRAINT fk_flight_departure_airport
		FOREIGN KEY (departure_airport_id) REFERENCES airport(airport_id)
    	ON DELETE RESTRICT
    	ON UPDATE CASCADE,
    CONSTRAINT fk_flight_arrival_airport
    	FOREIGN KEY (arrival_airport_id) REFERENCES airport(airport_id)
    	ON DELETE RESTRICT
    	ON UPDATE CASCADE,
    CONSTRAINT validate_flight_time 
    	CHECK (arrival_time > departure_time AND departure_time > boarding_time)
);

-- 8. Create Ticket Table
-- Purpose: Holds Ticket Data.
CREATE TABLE IF NOT EXISTS ticket
(
    ticket_id BIGINT AUTO_INCREMENT,
    flight_number VARCHAR(255) NOT NULL,
    user_id BIGINT NOT NULL,
    seat_number VARCHAR(20) NOT NULL,
    PRIMARY KEY (ticket_id),
    -- CONSTRAINT unique_cust_per_flight UNIQUE (user_id, flight_number), -- This constraint makes it so that a user can only book one flight. However, this is not accurate because a customer can book multiople seats in a flight. 
    CONSTRAINT unique_seat_per_flight UNIQUE (flight_number, seat_number), -- Constraint to make sure one seat number per flight 
    CONSTRAINT fk_ticket_flight
        FOREIGN KEY (flight_number) REFERENCES flight(flight_number)
        ON DELETE CASCADE -- If flight is deleted ticket is deleted
    	ON UPDATE CASCADE, -- If flight is updated ticket is updated
    CONSTRAINT fk_ticket_customer
        FOREIGN KEY (user_id) REFERENCES customer(user_id)
        ON DELETE CASCADE -- If customer is deleted ticket is deleted
    	ON UPDATE CASCADE, -- If customer is updated ticket is updated
    CONSTRAINT fk_ticket_seat
        FOREIGN KEY (seat_number) REFERENCES seat(seat_number)
        ON DELETE RESTRICT  -- Prevent seat is deletion
    	ON UPDATE CASCADE  -- If seat is updated ticket is updated
);

-- 9. Create Booking Table
-- Purpose: Holds Booking (ticket price) Data.
CREATE TABLE IF NOT EXISTS booking
(
    booking_id BIGINT AUTO_INCREMENT,
    ticket_id BIGINT UNIQUE NOT NULL,
    booking_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    flight_price DECIMAL(10, 2) NOT NULL DEFAULT 150.00,
    seat_price DECIMAL(10, 2) NOT NULL,
    tax DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (booking_id),
    CONSTRAINT fk_booking_ticket
        FOREIGN KEY (ticket_id) REFERENCES ticket(ticket_id)
        ON DELETE CASCADE -- If ticket is deleted, booking is deleted
        ON UPDATE CASCADE -- If ticket updated booking is updated
);

-- booking trigger to dynamically calculate the ticket pricing given ticket_id
DELIMITER //
CREATE TRIGGER calculate_booking_cost
BEFORE INSERT ON booking
FOR EACH ROW
BEGIN
	SET NEW.seat_price = 
    (
		SELECT seat_price
        FROM ticket
        JOIN seat USING (seat_number)
        JOIN class USING (class_type)
        WHERE ticket_id = NEW.ticket_id
    );
	SET NEW.tax = (NEW.flight_price + NEW.seat_price) * 0.15; -- tax is 15% | default flight_price is 150.0 
    SET NEW.total_price = NEW.flight_price + NEW.tax + NEW.seat_price;
END //
DELIMITER ;

-- ************************************ --
--               Part B                 --
-- The sample of the data of each table --
-- ************************************ --

-- 1. Sample Data for Airport_location
-- Purpose: Store data about airport location
INSERT INTO airport_location (location_zip, city, state) VALUES
(10001, 'New York', 'NY'),
(90045, 'Los Angeles', 'CA'),
(60666, 'Chicago', 'IL'),
(77032, 'Houston', 'TX'),
(30320, 'Atlanta', 'GA'),
(80249, 'Denver', 'CO'),
(75261, 'Dallas', 'TX'),
(94128, 'San Francisco', 'CA'),
(98158, 'Seattle', 'WA'),
(33142, 'Miami', 'FL');


-- 2. Sample Data for Airport
-- Purpose: Store data about airport
INSERT INTO airport (airport_name, code, location_zip) VALUES
('John F. Kennedy International Airport', 'JFK', 10001),
('Los Angeles International Airport', 'LAX', 90045),
('O\'Hare International Airport', 'ORD', 60666),
('George Bush Intercontinental Airport', 'IAH', 77032),
('Hartsfield-Jackson Atlanta International Airport', 'ATL', 30320),
('Denver International Airport', 'DEN', 80249),
('Dallas/Fort Worth International Airport', 'DFW', 75261),
('San Francisco International Airport', 'SFO', 94128),
('Seattle-Tacoma International Airport', 'SEA', 98158),
('Miami International Airport', 'MIA', 33142);

-- 3. Sample Data for Customer
-- Purpose: Store data about customer
INSERT INTO customer (first_name, last_name, email, phone, passport_number) VALUES
('Alice', 'Smith', 'alice.smith@example.com', '111-222-3333', 'PS123456'),
('Bob', 'Johnson', 'bob.j@example.com', '444-555-6666', 'PS789012'),
('Charlie', 'Brown', 'cbrownie@example.com','777-888-9999', 'PS345678'),
('Diana', 'Prince', 'diana.p@example.com', '222-333-4444', 'PS901234'),
('Eve', 'Adams', 'eve.a@example.com', '555-666-7777', 'PS567890'),
('Frank', 'White', 'frank.w@example.com', '888-999-0000', 'PS654321'),
('Grace', 'Taylor', 'grace.t@example.com', '123-456-7890', 'PS098765'),
('Henry', 'Miller','henry.m@example.com', '321-654-9870', 'PS246813'),
('Ivy', 'Davis', 'ivy.d@example.com', '987-654-3210', 'PS135792'),
('Jack', 'Garcia', 'jack.g@example.com', '987-654-3212', 'PS864209'),
('Jerry', 'Jones', 'JerrJ.g@example.com', '967-694-3112', 'PS864569'),
('Liam', 'Walker', 'liam.w@example.com', '222-444-6666', 'PS777888'),
('Mia', 'Harris', 'mia.h@example.com', '333-555-7777', 'PS888999'),
('Noah', 'Clark', 'noah.c@example.com', '444-666-8888', 'PS999000'),
('Olivia', 'Lewis', 'olivia.l@example.com', '555-777-9999', 'PS111222'),
('Sophia', 'Hall', 'sophia.h@example.com', '666-888-0000', 'PS333444');

-- 3. Sample Data for Customer
-- Purpose: Store data about customer
INSERT INTO authentication (user_id, username, password) VALUES
(1, 'asmith', 'pass123'),
(2, 'bjohnson', 'securepwd'),
(3, 'cbrown', 'mysecret'),
(4, 'dprince', 'wonderw'),
(5, 'eadams', 'evypass'),
(6, 'fwhite', 'frankpwd'),
(7, 'gtaylor', 'gracet'),
(8, 'hmiller', 'henry_m'),
(9, 'idavis', 'ivy_d'),
(10, 'jgarcia', 'jackg'),
(11, 'jjones', 'jj123'),
(12, 'lwalker', 'liampass'),
(13, 'mharris', 'miapass'),
(14, 'nclark', 'noahpass'),
(15, 'olewis', 'oliviapass'),
(16, 'shall', 'sophiapass');

-- 4. Sample Data for Class
-- Purpose: Store data about seat class
INSERT INTO class (class_type, seat_price) VALUES
('First Class', 700.00),
('Business', 350.00),
('Economy', 100.00);

-- 5. Sample Data for Seat
-- Purpose: Store data to map seat_number to specific class
INSERT INTO seat (seat_number, class_type) VALUES
('A1', 'First Class'),
('A2', 'First Class'),
('A3', 'First Class'),
('A4', 'First Class'),
('A5', 'First Class'),
('B1', 'Business'),
('B2', 'Business'),
('B3', 'Business'),
('B4', 'Business'),
('B5', 'Business'),
('C1', 'Economy'),
('C2', 'Economy'),
('C3', 'Economy'),
('C4', 'Economy'),
('C5', 'Economy'),
('C6', 'Economy');

-- 5. Sample Data for Flight
-- Purpose: Store data flight
-- 7. Sample Data for Flight (Each Airport has 5 Flights)
INSERT INTO flight (flight_number, airline, departure_airport_id, arrival_airport_id, boarding_time, departure_time, arrival_time, gate_number) VALUES
-- Airport 1 (JFK)
('AA101', 'American Airlines', 1, 2, '2025-08-01 07:00:00', '2025-08-01 07:30:00', '2025-08-01 10:30:00', 'A12'),
('AA102', 'American Airlines', 1, 3, '2025-08-01 09:00:00', '2025-08-01 09:30:00', '2025-08-01 12:30:00', 'A13'),
('AA103', 'American Airlines', 1, 4, '2025-08-01 11:00:00', '2025-08-01 11:30:00', '2025-08-01 14:30:00', 'A14'),
('AA104', 'American Airlines', 1, 5, '2025-08-01 13:00:00', '2025-08-01 13:30:00', '2025-08-01 16:30:00', 'A15'),
('AA105', 'American Airlines', 1, 6, '2025-08-01 15:00:00', '2025-08-01 15:30:00', '2025-08-01 18:30:00', 'A16'),

-- Airport 2 (LAX)
('DL201', 'Delta Airlines', 2, 1, '2025-08-02 07:00:00', '2025-08-02 07:30:00', '2025-08-02 10:30:00', 'B01'),
('DL202', 'Delta Airlines', 2, 3, '2025-08-02 09:00:00', '2025-08-02 09:30:00', '2025-08-02 12:30:00', 'B02'),
('DL203', 'Delta Airlines', 2, 4, '2025-08-02 11:00:00', '2025-08-02 11:30:00', '2025-08-02 14:30:00', 'B03'),
('DL204', 'Delta Airlines', 2, 5, '2025-08-02 13:00:00', '2025-08-02 13:30:00', '2025-08-02 16:30:00', 'B04'),
('DL205', 'Delta Airlines', 2, 6, '2025-08-02 15:00:00', '2025-08-02 15:30:00', '2025-08-02 18:30:00', 'B05'),

-- Airport 3 (ORD)
('UA301', 'United Airlines', 3, 1, '2025-08-03 07:00:00', '2025-08-03 07:30:00', '2025-08-03 10:30:00', 'C01'),
('UA302', 'United Airlines', 3, 2, '2025-08-03 09:00:00', '2025-08-03 09:30:00', '2025-08-03 12:30:00', 'C02'),
('UA303', 'United Airlines', 3, 4, '2025-08-03 11:00:00', '2025-08-03 11:30:00', '2025-08-03 14:30:00', 'C03'),
('UA304', 'United Airlines', 3, 5, '2025-08-03 13:00:00', '2025-08-03 13:30:00', '2025-08-03 16:30:00', 'C04'),
('UA305', 'United Airlines', 3, 6, '2025-08-03 15:00:00', '2025-08-03 15:30:00', '2025-08-03 18:30:00', 'C05'),

-- Airport 4 (IAH)
('SW401', 'Southwest Airlines', 4, 1, '2025-08-04 07:00:00', '2025-08-04 07:30:00', '2025-08-04 10:30:00', 'D01'),
('SW402', 'Southwest Airlines', 4, 2, '2025-08-04 09:00:00', '2025-08-04 09:30:00', '2025-08-04 12:30:00', 'D02'),
('SW403', 'Southwest Airlines', 4, 3, '2025-08-04 11:00:00', '2025-08-04 11:30:00', '2025-08-04 14:30:00', 'D03'),
('SW404', 'Southwest Airlines', 4, 5, '2025-08-04 13:00:00', '2025-08-04 13:30:00', '2025-08-04 16:30:00', 'D04'),
('SW405', 'Southwest Airlines', 4, 6, '2025-08-04 15:00:00', '2025-08-04 15:30:00', '2025-08-04 18:30:00', 'D05'),

-- Airport 5 (ATL)
('AA501', 'American Airlines', 5, 1, '2025-08-05 07:00:00', '2025-08-05 07:30:00', '2025-08-05 10:30:00', 'E01'),
('AA502', 'American Airlines', 5, 2, '2025-08-05 09:00:00', '2025-08-05 09:30:00', '2025-08-05 12:30:00', 'E02'),
('AA503', 'American Airlines', 5, 3, '2025-08-05 11:00:00', '2025-08-05 11:30:00', '2025-08-05 14:30:00', 'E03'),
('AA504', 'American Airlines', 5, 4, '2025-08-05 13:00:00', '2025-08-05 13:30:00', '2025-08-05 16:30:00', 'E04'),
('AA505', 'American Airlines', 5, 6, '2025-08-05 15:00:00', '2025-08-05 15:30:00', '2025-08-05 18:30:00', 'E05'),

-- Airport 6 (DEN)
('DL601', 'Delta Airlines', 6, 1, '2025-08-06 07:00:00', '2025-08-06 07:30:00', '2025-08-06 10:30:00', 'F01'),
('DL602', 'Delta Airlines', 6, 2, '2025-08-06 09:00:00', '2025-08-06 09:30:00', '2025-08-06 12:30:00', 'F02'),
('DL603', 'Delta Airlines', 6, 3, '2025-08-06 11:00:00', '2025-08-06 11:30:00', '2025-08-06 14:30:00', 'F03'),
('DL604', 'Delta Airlines', 6, 4, '2025-08-06 13:00:00', '2025-08-06 13:30:00', '2025-08-06 16:30:00', 'F04'),
('DL605', 'Delta Airlines', 6, 5, '2025-08-06 15:00:00', '2025-08-06 15:30:00', '2025-08-06 18:30:00', 'F05'),

-- Airport 7 (DFW)
('UA701', 'United Airlines', 7, 1, '2025-08-07 07:00:00', '2025-08-07 07:30:00', '2025-08-07 10:30:00', 'G01'),
('UA702', 'United Airlines', 7, 2, '2025-08-07 09:00:00', '2025-08-07 09:30:00', '2025-08-07 12:30:00', 'G02'),
('UA703', 'United Airlines', 7, 3, '2025-08-07 11:00:00', '2025-08-07 11:30:00', '2025-08-07 14:30:00', 'G03'),
('UA704', 'United Airlines', 7, 4, '2025-08-07 13:00:00', '2025-08-07 13:30:00', '2025-08-07 16:30:00', 'G04'),
('UA705', 'United Airlines', 7, 5, '2025-08-07 15:00:00', '2025-08-07 15:30:00', '2025-08-07 18:30:00', 'G05'),

-- Airport 8 (SFO)
('SW801', 'Southwest Airlines', 8, 1, '2025-08-08 07:00:00', '2025-08-08 07:30:00', '2025-08-08 10:30:00', 'H01'),
('SW802', 'Southwest Airlines', 8, 2, '2025-08-08 09:00:00', '2025-08-08 09:30:00', '2025-08-08 12:30:00', 'H02'),
('SW803', 'Southwest Airlines', 8, 3, '2025-08-08 11:00:00', '2025-08-08 11:30:00', '2025-08-08 14:30:00', 'H03'),
('SW804', 'Southwest Airlines', 8, 4, '2025-08-08 13:00:00', '2025-08-08 13:30:00', '2025-08-08 16:30:00', 'H04'),
('SW805', 'Southwest Airlines', 8, 5, '2025-08-08 15:00:00', '2025-08-08 15:30:00', '2025-08-08 18:30:00', 'H05'),

-- Airport 9 (SEA)
('AA901', 'American Airlines', 9, 1, '2025-08-09 07:00:00', '2025-08-09 07:30:00', '2025-08-09 10:30:00', 'I01'),
('AA902', 'American Airlines', 9, 2, '2025-08-09 09:00:00', '2025-08-09 09:30:00', '2025-08-09 12:30:00', 'I02'),
('AA903', 'American Airlines', 9, 3, '2025-08-09 11:00:00', '2025-08-09 11:30:00', '2025-08-09 14:30:00', 'I03'),
('AA904', 'American Airlines', 9, 4, '2025-08-09 13:00:00', '2025-08-09 13:30:00', '2025-08-09 16:30:00', 'I04'),
('AA905', 'American Airlines', 9, 5, '2025-08-09 15:00:00', '2025-08-09 15:30:00', '2025-08-09 18:30:00', 'I05'),

-- Airport 10 (MIA)
('DL1001', 'Delta Airlines', 10, 1, '2025-08-10 07:00:00', '2025-08-10 07:30:00', '2025-08-10 10:30:00', 'J01'),
('DL1002', 'Delta Airlines', 10, 2, '2025-08-10 09:00:00', '2025-08-10 09:30:00', '2025-08-10 12:30:00', 'J02'),
('DL1003', 'Delta Airlines', 10, 3, '2025-08-10 11:00:00', '2025-08-10 11:30:00', '2025-08-10 14:30:00', 'J03'),
('DL1004', 'Delta Airlines', 10, 4, '2025-08-10 13:00:00', '2025-08-10 13:30:00', '2025-08-10 16:30:00', 'J04'),
('DL1005', 'Delta Airlines', 10, 5, '2025-08-10 15:00:00', '2025-08-10 15:30:00', '2025-08-10 18:30:00', 'J05');


-- 7. Sample Data for ticket
-- Purpose: Store ticket data
INSERT INTO ticket (flight_number, user_id, seat_number) VALUES
('AA101', 1, 'A1'),
('AA101', 2, 'C2'),
('AA101', 3, 'B1'),
('AA101', 4, 'C1'),
('AA102', 2, 'A1'),
('AA102', 3, 'C3'),
('AA102', 4, 'C4'),
('AA102', 5, 'A2'),
('AA103', 3, 'C5'),
('AA103', 4, 'C6'),
('AA103', 5, 'A3'),
('AA103', 6, 'B5'),
('AA104', 4, 'C2'),
('AA104', 5, 'C3'),
('AA104', 6, 'C1'),
('AA104', 7, 'A4'),
('AA105', 5, 'C4'),
('AA105', 6, 'C6'),
('AA105', 7, 'B1'),
('AA105', 8, 'A3'),
('DL201', 6, 'C4'),
('DL201', 7, 'A5'),
('DL201', 8, 'A1'),
('DL201', 9, 'C1'),
('DL202', 7, 'B3'),
('DL202', 8, 'A4'),
('DL202', 9, 'C6'),
('DL202', 10, 'C4'),
('DL203', 8, 'C6'),
('DL203', 9, 'A1'),
('DL203', 10, 'C5'),
('DL203', 11, 'C4'),
('DL204', 9, 'C1'),
('DL204', 10, 'B2'),
('DL204', 11, 'A1'),
('DL204', 12, 'B5'),
('DL205', 10, 'C1'),
('DL205', 11, 'A3'),
('DL205', 12, 'A2'),
('DL205', 13, 'C5'),
('UA301', 11, 'A2'),
('UA301', 12, 'B5'),
('UA301', 13, 'C6'),
('UA301', 14, 'A4'),
('UA302', 12, 'B4'),
('UA302', 13, 'A3'),
('UA302', 14, 'C2'),
('UA302', 15, 'A1'),
('UA303', 13, 'B4'),
('UA303', 14, 'A2'),
('UA303', 15, 'B2'),
('UA303', 16, 'C3'),
('UA304', 14, 'B1'),
('UA304', 15, 'B3'),
('UA304', 16, 'A2'),
('UA304', 1, 'C5'),
('UA305', 15, 'B3'),
('UA305', 16, 'B4'),
('UA305', 1, 'C1'),
('UA305', 2, 'C3'),
('SW401', 16, 'B3'),
('SW401', 1, 'C4'),
('SW401', 2, 'A1'),
('SW401', 3, 'C2'),
('SW402', 1, 'A5'),
('SW402', 2, 'B5'),
('SW402', 3, 'C1'),
('SW402', 4, 'B4'),
('SW403', 2, 'B5'),
('SW403', 3, 'C2'),
('SW403', 4, 'B4'),
('SW403', 5, 'C6'),
('SW404', 3, 'C1'),
('SW404', 4, 'C3'),
('SW404', 5, 'A2'),
('SW404', 6, 'C2'),
('SW405', 4, 'A5'),
('SW405', 5, 'A2'),
('SW405', 6, 'B3'),
('SW405', 7, 'C5'),
('AA501', 5, 'C2'),
('AA501', 6, 'B5'),
('AA501', 7, 'B1'),
('AA501', 8, 'C6'),
('AA502', 6, 'B5'),
('AA502', 7, 'C4'),
('AA502', 8, 'B1'),
('AA502', 9, 'B2'),
('AA503', 7, 'C1'),
('AA503', 8, 'A3'),
('AA503', 9, 'B5'),
('AA503', 10, 'A4'),
('AA504', 8, 'B5'),
('AA504', 9, 'C4'),
('AA504', 10, 'C3'),
('AA504', 11, 'A4'),
('AA505', 9, 'B1'),
('AA505', 10, 'B4'),
('AA505', 11, 'A2'),
('AA505', 12, 'C4'),
('DL601', 10, 'C5'),
('DL601', 11, 'B4'),
('DL601', 12, 'C3'),
('DL601', 13, 'A5'),
('DL602', 11, 'C5'),
('DL602', 12, 'B5'),
('DL602', 13, 'B4'),
('DL602', 14, 'A4'),
('DL603', 12, 'C6'),
('DL603', 13, 'A5'),
('DL603', 14, 'C2'),
('DL603', 15, 'A3'),
('DL604', 13, 'A4'),
('DL604', 14, 'A3'),
('DL604', 15, 'A1'),
('DL604', 16, 'B2'),
('DL605', 14, 'C2'),
('DL605', 15, 'A1'),
('DL605', 16, 'C3'),
('DL605', 1, 'B1'),
('UA701', 15, 'A4'),
('UA701', 16, 'B4'),
('UA701', 1, 'C6'),
('UA701', 2, 'A1'),
('UA702', 16, 'A5'),
('UA702', 1, 'B1'),
('UA702', 2, 'B5'),
('UA702', 3, 'C1'),
('UA703', 1, 'C5'),
('UA703', 2, 'C6'),
('UA703', 3, 'C1'),
('UA703', 4, 'B2'),
('UA704', 2, 'B2'),
('UA704', 3, 'C2'),
('UA704', 4, 'A4'),
('UA704', 5, 'A3'),
('UA705', 3, 'B3'),
('UA705', 4, 'B2'),
('UA705', 5, 'C4'),
('UA705', 6, 'A1'),
('SW801', 4, 'B1'),
('SW801', 5, 'B4'),
('SW801', 6, 'C6'),
('SW801', 7, 'C2'),
('SW802', 5, 'A1'),
('SW802', 6, 'B3'),
('SW802', 7, 'C5'),
('SW802', 8, 'C6'),
('SW803', 6, 'B5'),
('SW803', 7, 'A4'),
('SW803', 8, 'B3'),
('SW803', 9, 'C1'),
('SW804', 7, 'B1'),
('SW804', 8, 'C6'),
('SW804', 9, 'C4'),
('SW804', 10, 'A5'),
('SW805', 8, 'B5'),
('SW805', 9, 'C5'),
('SW805', 10, 'C4'),
('SW805', 11, 'A5'),
('AA901', 9, 'A5'),
('AA901', 10, 'A2'),
('AA901', 11, 'C4'),
('AA901', 12, 'B4'),
('AA902', 10, 'A4'),
('AA902', 11, 'A1'),
('AA902', 12, 'C5'),
('AA902', 13, 'C1'),
('AA903', 11, 'A3'),
('AA903', 12, 'C4'),
('AA903', 13, 'B4'),
('AA903', 14, 'C6'),
('AA904', 12, 'C6'),
('AA904', 13, 'A2'),
('AA904', 14, 'A5'),
('AA904', 15, 'A4'),
('AA905', 13, 'C1'),
('AA905', 14, 'B1'),
('AA905', 15, 'C2'),
('AA905', 16, 'B5'),
('DL1001', 14, 'A3'),
('DL1001', 15, 'C6'),
('DL1001', 16, 'B1'),
('DL1001', 1, 'A1'),
('DL1002', 15, 'A3'),
('DL1002', 16, 'A2'),
('DL1002', 1, 'B1'),
('DL1002', 2, 'B5'),
('DL1003', 16, 'C5'),
('DL1003', 1, 'C2'),
('DL1003', 2, 'A4'),
('DL1003', 3, 'A5'),
('DL1004', 1, 'A5'),
('DL1004', 2, 'C6'),
('DL1004', 3, 'B3'),
('DL1004', 4, 'A2'),
('DL1005', 2, 'B1'),
('DL1005', 3, 'A2'),
('DL1005', 4, 'A3'),
('DL1005', 5, 'C4');

-- 8. Sample Data for booking
-- Purpose: Store booking data
-- booking_date and flight_price have default values 
-- seat_cost, tax, and total_price are dynamically calculated using the calculate_booking_cost trigger before insertion using the ticket_id value to retreive the seat pricing. 
INSERT INTO booking (ticket_id)
SELECT ticket_id FROM ticket;

-- ************************************ --
--               Part C                 --
--        Designing SQL Queries         --
-- ************************************ –

-- *************************** 
-- Query 1
-- Purpose: Get all ticket information including the customer who owns the ticket, the ticket type with seat information, and the booking details of that ticket.
-- Expected: Each row shows a ticket id, name of customer and email of customer, flight number seat number, seat class, booking date, and booking price information (flight price, seat price, tax, total price)
SELECT 
    ticket.ticket_id,
    customer.first_name,
    customer.last_name,
    customer.email,
    ticket.flight_number,
    seat.seat_number,
    class.class_type,
    booking.booking_date,
    booking.flight_price,
    booking.seat_price,
    booking.tax,
    booking.total_price
FROM ticket
JOIN customer 
    ON ticket.user_id = customer.user_id
JOIN seat
    ON ticket.seat_number = seat.seat_number
JOIN class
    ON seat.class_type = class.class_type
JOIN booking
    ON ticket.ticket_id = booking.ticket_id
ORDER BY ticket.ticket_id;

-- *************************** 
-- Query 2
-- Purpose: List flights where one or more tickets have been sold.
-- Expected: Flight numbers with a count of tickets.
SELECT flight_number, COUNT(*) AS ticket_count
FROM ticket
GROUP BY flight_number
HAVING COUNT(*) >= 1;

-- *************************** 
-- Query 3
-- Purpose: Show all passengers on a specific flight (flight requirement can change).
-- Expected: List of customer names and id's who are passengers on a flight.
SELECT customer.user_id, customer.first_name, customer.last_name
FROM customer
JOIN ticket 
    ON customer.user_id = ticket.user_id
WHERE ticket.flight_number = 'AA101';

-- *************************** 
-- Query 3 - extension
-- Purpose: Show all passengers on a specific flight and class seat (class and flight requirements can change).
-- Expected: List of customer names who booked First Class.
SELECT customer.user_id, customer.first_name, customer.last_name
FROM customer
JOIN ticket
    ON customer.user_id = ticket.user_id
JOIN seat 
    ON ticket.seat_number = seat.seat_number
JOIN class 
    ON seat.class_type = class.class_type
WHERE ticket.flight_number = 'AA101'
  AND class.class_type = 'First Class';

-- *************************** 
-- Query 4
-- Purpose: List all flights and tickets, even if a flight has no ticket.
-- Expected: Full outer result with flight number and ticket id with null values if flight does not have any tickets
SELECT flight.flight_number, ticket.ticket_id
FROM flight
LEFT JOIN ticket ON flight.flight_number = ticket.flight_number
UNION
SELECT flight.flight_number, ticket.ticket_id
FROM flight
RIGHT JOIN ticket ON flight.flight_number = ticket.flight_number;

-- *************************** 
-- Query 5
-- Purpose: Show all customers who have tickets and don't have tickets
-- Expected: List of customer names and ID with true or false for has ticket.
SELECT customer.user_id, customer.first_name, customer.last_name, TRUE AS 'Has Ticket'
FROM customer
WHERE customer.user_id IN (SELECT ticket.user_id FROM ticket)
UNION
SELECT customer.user_id, customer.first_name, customer.last_name, FALSE AS 'Has Ticket'
FROM customer
WHERE customer.user_id NOT IN (SELECT ticket.user_id FROM ticket);

-- *************************** 
-- Query 6
-- Purpose: List available seat numbers for flight 'AA101' (flight requirement can change)
-- Expected: Seat numbers marked as available for the specific flight.
SELECT seat.seat_number
FROM seat
WHERE seat.seat_number NOT IN (
    SELECT ticket.seat_number 
    FROM ticket
    WHERE ticket.flight_number = 'AA101'
)
ORDER BY seat.seat_number;

-- *************************** 
-- Query 7
-- Purpose: Show all bookings made by user
-- Expected: Booking ID, total price, and booking date.
SELECT 
    ticket.ticket_id, 
    ticket.flight_number, 
    departure_airport.code AS departure_airport, 
    arrival_airport.code AS arrival_airport, 
    seat.seat_number, 
    class.class_type
  FROM ticket
    JOIN seat ON ticket.seat_number = seat.seat_number
    JOIN class ON seat.class_type = class.class_type
    JOIN flight ON ticket.flight_number = flight.flight_number
    JOIN airport AS departure_airport ON flight.departure_airport_id = departure_airport.airport_id
    JOIN airport AS arrival_airport ON flight.arrival_airport_id = arrival_airport.airport_id
  WHERE user_id = 1
  ORDER BY ticket.ticket_id;

-- *************************** 
-- Query 8
-- Purpose: Show all flights at an airport, including its name and code.
-- Expected: List of flight numbers, airline names, and departure airport details.
SELECT 
    flight.flight_number,
    flight.airline,
    departure_airport.code AS departure_airport_code,
    arrival_airport.code AS arrival_airport_code,
    flight.boarding_time,
    flight.departure_time,
    flight.arrival_time,
    flight.gate_number
FROM flight
JOIN airport departure_airport 
    ON flight.departure_airport_id = departure_airport.airport_id
JOIN airport arrival_airport 
    ON flight.arrival_airport_id = arrival_airport.airport_id
WHERE departure_airport.airport_id = 1;

-- *************************** 
-- Query 9
-- Purpose: Show all available seats for a specific flight and class type.
-- Expected: List of seat numbers that are still available for the given flight and class type.
SELECT 
    seat.seat_number,
    class.class_type,
    'AA101' AS flight_number
FROM seat
JOIN class
    ON seat.class_type = class.class_type
WHERE class.class_type = 'Economy'
  AND seat.seat_number NOT IN (
        SELECT seat_number
        FROM ticket
        WHERE flight_number = 'AA101'
    )
ORDER BY seat.seat_number;

-- *************************** 
-- Query 10
-- Purpose: Get all flight details of a given flight including the airport and airport location of the flight
-- Expected: List of flights with their flight information, boarding details, and airport with location details.
SELECT
    flight.flight_number, 
    flight.airline,
    airport.code AS departure_airport, 
    arrival_airport.code AS arrival_airport, 
    flight.boarding_time,
    flight.departure_time,
    flight.arrival_time,
    flight.gate_number,
    airport.airport_name, 
    airport_location.city, 
    airport_location.state, 
    airport_location.location_zip
  FROM flight
    JOIN airport ON flight.departure_airport_id = airport.airport_id
    JOIN airport_location on airport.location_zip = airport_location.location_zip
    JOIN airport AS arrival_airport ON flight.arrival_airport_id = arrival_airport.airport_id
  WHERE flight_number = 'AA101'

-- End of Script (July 30, 2025)
