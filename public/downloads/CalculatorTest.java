import static org.junit.Assert.*;
import org.junit.Test;

public class CalculatorTest {

    @Test
    public void testAdd() {
        assertEquals(5, Calculator.add(2, 3));
        assertEquals(-1, Calculator.add(2, -3));
        assertEquals(0, Calculator.add(0, 0));
    }

    @Test
    public void testSubtract() {
        assertEquals(-1, Calculator.subtract(2, 3));
        assertEquals(5, Calculator.subtract(2, -3));
        assertEquals(0, Calculator.subtract(0, 0));
    }

    @Test
    public void testMultiply() {
        assertEquals(6, Calculator.multiply(2, 3));
        assertEquals(-6, Calculator.multiply(2, -3));
        assertEquals(0, Calculator.multiply(0, 5));
        assertEquals(0, Calculator.multiply(0, 0));
    }

    @Test
    public void testDivide() {
        assertEquals(2, Calculator.divide(6, 3));
        assertEquals(-2, Calculator.divide(6, -3));

        // Testing division by zero
        try {
            Calculator.divide(5, 0);
            fail("Expected IllegalArgumentException");
        } catch (IllegalArgumentException e) {
            assertEquals("Cannot divide by zero", e.getMessage());
        }

        // Testing division with zero as numerator
        assertEquals(0, Calculator.divide(0, 5));
    }

}
