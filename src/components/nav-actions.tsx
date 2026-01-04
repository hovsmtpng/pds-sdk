"use client";

import { useState, useEffect, useId } from "react";
import {
  TvMinimal,
  UserCog,
  Moon,
  Sun,
  Globe,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Switch, SwitchIndicator, SwitchWrapper } from "@/components/ui/switch";
import { useTheme } from "@/components/theme-provider";
import { Clock } from "./clock";
import { useTranslation } from "react-i18next";

interface NavActionsProps {
  scrolled: boolean;
  showClock: boolean;
  showLanguageChange: boolean;
  showThemeChange: boolean;
  showBackToLobby: boolean;
  showVisibility: boolean;
  handleOpen: () => void;
  lobby: () => void;
}

export function NavActions({
  scrolled,
  showClock,
  showLanguageChange,
  showThemeChange,
  showBackToLobby,
  showVisibility,
  handleOpen,
  lobby
}: NavActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const id = useId();

  const [isEnglish, setIsEnglish] = useState(i18n.language === "en");

  // toggle tema
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  // toggle bahasa
  const handleToggleLanguage = (checked: boolean) => {
    const newLang = checked ? "en" : "id";
    setIsEnglish(checked);
    i18n.changeLanguage(newLang);
  };

  // sinkronisasi state bahasa dari i18n
  useEffect(() => {
    setIsEnglish(i18n.language === "en");
  }, [i18n.language]);

  useEffect(() => {
    setIsOpen(false);
  }, []);

  return (
    <div className="flex items-center gap-3 text-sm">
      {/* clock */}
      {showClock && <Clock className="hidden" />}

      {/* switch bahasa */}
      {showLanguageChange && (
        <div className="flex items-center space-x-2.5">
          <Globe className="w-4 h-4 text-muted-foreground" />

          <Label htmlFor={id} className="text-xs font-medium">
            {t('language')}
          </Label>
          <SwitchWrapper>
            <Switch
              id={id}
              size="lg"
              checked={isEnglish}
              onCheckedChange={handleToggleLanguage}
            />
            <SwitchIndicator
              state="off"
              className="text-[12px] pl-1 font-medium text-muted-foreground uppercase"
            >
              ID
            </SwitchIndicator>
            <SwitchIndicator
              state="on"
              className="text-[12px] pr-1 font-medium text-primary-foreground uppercase"
            >
              EN
            </SwitchIndicator>
          </SwitchWrapper>
        </div>
      )}

      {/* theme toggle */}
      {showThemeChange && (
        <Button
          className={`transition-all duration-500 ease-in-out ${scrolled ? "rounded-full px-2 py-2" : "rounded-md px-4 py-2"
            }`}
          variant="outline"
          size="icon"
          onClick={toggleTheme}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] transition-all dark:scale-0 dark:-rotate-90 dark:text-white" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] transition-all scale-0 rotate-90 dark:scale-100 dark:rotate-0 dark:text-white" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      )}

      {/* Go to Lobby */}
      {showBackToLobby && (
        <Button
          className={`transition-all duration-500 ease-in-out ${scrolled ? "rounded-full px-2 py-2" : "rounded-md px-4 py-2"
            }`}
          variant="outline"
          size="icon"
          onClick={lobby}
        >
          <TvMinimal className="h-[1.2rem] w-[1.2rem] dark:text-white" />
        </Button>
      )}


      {/* Visibility Setting */}
      {showVisibility && (
        <>
          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:h-5"
          />
          <Button
            className={`transition-all duration-500 ease-in-out ${scrolled ? "rounded-full px-2 py-2" : "rounded-md px-4 py-2"
              }`}
            variant="outline"
            onClick={handleOpen}
          >
            <UserCog className="h-[1.2rem] w-[1.2rem] dark:text-white mr-1" />
            Visibility Setting
          </Button>
        </>
      )}
    </div>
  );
}
