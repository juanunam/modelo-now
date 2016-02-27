-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema modelonow
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema modelonow
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `modelonow` DEFAULT CHARACTER SET utf8 ;
USE `modelonow` ;

-- -----------------------------------------------------
-- Table `modelonow`.`Persona`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `modelonow`.`Persona` (
  `idPersona` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(45) NULL,
  `LastName` VARCHAR(45) NULL,
  `Genre` TINYINT(1) NULL,
  `BirthDate` DATE NULL,
  `CreatedDate` DATETIME NULL,
  `Email` VARCHAR(45) NULL,
  `CuentaFacebook` VARCHAR(45) NULL,
  PRIMARY KEY (`idPersona`),
  UNIQUE INDEX `CuentaFacebook_UNIQUE` (`CuentaFacebook` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `modelonow`.`Producto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `modelonow`.`Producto` (
  `NoProducto` INT NOT NULL,
  `Name` VARCHAR(45) NULL,
  `Price` FLOAT NULL,
  `Description` VARCHAR(45) NULL,
  `Amount` INT NULL,
  PRIMARY KEY (`NoProducto`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `modelonow`.`Promociones`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `modelonow`.`Promociones` (
  `idPromociones` VARCHAR(15) NOT NULL,
  `DateEnd` DATETIME NULL,
  `DateStart` DATETIME NULL,
  `Enable` TINYINT(1) NULL,
  `Percent` FLOAT NULL,
  `NoProducto` INT NOT NULL,
  PRIMARY KEY (`idPromociones`),
  INDEX `fk_Promociones_Producto_idx` (`NoProducto` ASC),
  CONSTRAINT `fk_Promociones_Producto`
    FOREIGN KEY (`NoProducto`)
    REFERENCES `modelonow`.`Producto` (`NoProducto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `modelonow`.`Venta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `modelonow`.`Venta` (
  `idVenta` INT NOT NULL AUTO_INCREMENT,
  `Total` DOUBLE NOT NULL,
  `idPersona` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idVenta`),
  INDEX `fk_Venta_Persona1_idx` (`idPersona` ASC),
  CONSTRAINT `fk_Venta_Persona1`
    FOREIGN KEY (`idPersona`)
    REFERENCES `modelonow`.`Persona` (`idPersona`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `modelonow`.`Venta_Producto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `modelonow`.`Venta_Producto` (
  `idVenta` INT NOT NULL,
  `Amount` INT NULL,
  `SubTotal` DOUBLE NULL,
  INDEX `fk_Venta_Producto_Venta1_idx` (`idVenta` ASC),
  CONSTRAINT `fk_Venta_Producto_Venta1`
    FOREIGN KEY (`idVenta`)
    REFERENCES `modelonow`.`Venta` (`idVenta`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `modelonow`.`Constantes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `modelonow`.`Constantes` (
  `SecretKey` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`SecretKey`))
ENGINE = InnoDB;

USE `modelonow`;

DELIMITER $$
USE `modelonow`$$
CREATE DEFINER = CURRENT_USER TRIGGER `modelonow`.`Persona_BEFORE_INSERT` BEFORE INSERT ON `Persona` FOR EACH ROW
BEGIN
	 SET NEW.CreatedDate = NOW();
END$$


DELIMITER ;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
