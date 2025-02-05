/* eslint-disable @typescript-eslint/no-unused-vars */

type ThemeColors = "Zinc" | "Rose" | "Blue" | "Green" | "Orange" | "Purple"
interface ThemeColorStateParams{
    themeColor: ThemeColors;
    setThemeColor: React.Dispatch<React.SetStateAction<ThemeColors>> 
}